#!/usr/bin/env /home/pi/enviroplus-aws/pi/enviro-env/bin/python3

import time
import os
import sys
import json
try:
    # Transitional fix for breaking change in LTR559
    from ltr559 import LTR559
    ltr559 = LTR559()
except ImportError:
    import ltr559

from bme280 import BME280
from pms5003 import PMS5003, ReadTimeoutError as pmsReadTimeoutError
from enviroplus import gas
from subprocess import PIPE, Popen

import logging

from enviro_config import EnviroConfig
from enviro_client import EnviroClient
from enviro_logging import EnviroLogging
from enviro_display import EnviroDisplay


logging.basicConfig(
    format='%(asctime)s.%(msecs)03d %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')

logging.info("""all-in-one.py - Displays readings from all of Enviro plus' sensors

Press Ctrl+C to exit!

""")

# BME280 temperature/pressure/humidity sensor
bme280 = BME280()

# PMS5003 particulate sensor
pms5003 = PMS5003()


message = ""

# Get Raspberry Pi serial number to use as ID
def get_serial_number():
    with open('/proc/cpuinfo', 'r') as f:
        for line in f:
            if line[0:6] == 'Serial':
                return line.split(":")[1].strip()



# Get the temperature of the CPU for compensation
def get_cpu_temperature():
    process = Popen(['vcgencmd', 'measure_temp'], stdout=PIPE, universal_newlines=True)
    output, _error = process.communicate()
    return float(output[output.index('=') + 1:output.rindex("'")])


# Tuning factor for compensation. Decrease this number to adjust the
# temperature down, and increase to adjust up
factor = 0.8

# cpu temperature is not very stable compared to raw temp
# so take a long view to flatten out
cpu_temps = [get_cpu_temperature()] * 30

delay = 0.5  # Debounce the proximity tap
disp_mode = 1     # The starting mode
last_page = 0
light = 1

# Create a values dict to store the data
variables = [
    "collection_time",
    "temperature",
             "pressure",
             "humidity",
             "light",
             "oxidised",
             "reduced",
             "nh3",
             "pm1",
             "pm25",
             "pm10",
    "raw_temperature",
    "comp_factor"
]

units = [
    "",
                "C",
                "hPa",
                "%",
                "Lux",
                "kO",
                "kO",
                "kO",
                "ug/m3",
                "ug/m3",
                "ug/m3"
]

CONFIG_FILE = 'enviro_config.json'

dir_path = os.path.dirname(os.path.realpath(__file__))
serial_number = get_serial_number()

e_config = EnviroConfig(serial_number, CONFIG_FILE)
config = e_config.get_config()
if config["log_to_aws"]:
    e_client = EnviroClient(serial_number, config)
e_logging = EnviroLogging(serial_number, config)
if config["output_to_screen"]:
    e_display = EnviroDisplay(config, variables)

count = 0
# 100 approx every 5 mins
interval = 100
cumulative_variables = {}
for mode in range(1,len(variables)):
    cumulative_variables[variables[mode]] = 0.0

# The main loop
try:
    e_logging.output_header(variables)
    while True:
        proximity = ltr559.get_proximity()

        # If the proximity crosses the threshold, toggle the mode
        if proximity > 1500 and time.time() - last_page > delay:
            disp_mode += 1
            disp_mode %= len(variables)
            if disp_mode == 0:
                disp_mode = 1
            last_page = time.time()

        # logging.info(f'Mode: {disp_mode}')
        try:
            pm_data = pms5003.read()
        except pmsReadTimeoutError:
            pms5003.reset()
            pm_data = pms5003.read()

        gas_data = gas.read_all()

        data = {}
        for mode_idx in range(len(variables)):
            # One mode for each variable
            mode = variables[mode_idx]

            if mode == "collection_time":
                import datetime
                now = datetime.datetime.now().replace(microsecond=0)
                data[mode] = now

            if mode == "temperature":
                cpu_temp = get_cpu_temperature()
                # Smooth out with some averaging to decrease jitter
                cpu_temps = cpu_temps[1:] + [cpu_temp]
                avg_cpu_temp = sum(cpu_temps) / float(len(cpu_temps))
                raw_temp = bme280.get_temperature()
            # Compensation factor for temperature
                comp_factor = e_config.get_comp_factor(avg_cpu_temp, raw_temp)
                # print(f'raw {raw_temp} cpu {cpu_temp}')
            # raw 23.36554477615539 cpu 33.6
                comp_temp = raw_temp - ((avg_cpu_temp - raw_temp) / comp_factor)
                data[mode] = float("{:.2f}".format(comp_temp))
                data['raw_temperature'] = float("{:.2f}".format(raw_temp))
                data['comp_factor'] = float("{:.2f}".format(comp_factor))

            if mode == "pressure":
                unit = "hPa"
                data[mode] = bme280.get_pressure()

            if mode == "humidity":
                unit = "%"
                data[mode] = bme280.get_humidity()

            if mode == "light":
                if proximity < 10:
                    data[mode] = ltr559.get_lux()
                else:
                    data[mode] = 1

            if mode == "oxidised":
                data[mode] = gas_data.oxidising / 1000

            if mode == "reduced":
                data[mode] = gas_data.reducing / 1000

            if mode == "nh3":
                data[mode] = gas_data.nh3 / 1000

            if mode == "pm1":
                # variable = "pm1"
                data[mode] = float(pm_data.pm_ug_per_m3(1.0))

            if mode == "pm25":
                # variable = "pm25"
                data[mode] = float(pm_data.pm_ug_per_m3(2.5))

            if mode == "pm10":
                # variable = "pm10"
                data[mode] = float(pm_data.pm_ug_per_m3(10))

            if mode_idx > 0:
                cumulative_variables[mode] += data[mode]

        count += 1

        # print(data)
        if config["output_to_screen"]:
            e_display.display_text(variables[disp_mode], data[variables[disp_mode]], units[disp_mode])
        e_logging.output_to_file(variables, data)

        if config["log_to_aws"]:
            # 
            if count % interval == 0:
                out_data = {}
                out_data[variables[0]] = data[variables[0]]
                for mode in range(1, len(variables)):
                    out_data[variables[mode]] = cumulative_variables[variables[mode]] / interval
                    cumulative_variables[variables[mode]] = 0.0
                count = 0
                e_client.upload_values(out_data)


# Exit cleanly
except KeyboardInterrupt:
    sys.exit(0)
