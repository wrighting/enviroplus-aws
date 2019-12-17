#!/usr/bin/env /home/pi/enviroplus-aws/pi/enviro-env/bin/python3

import time
import colorsys
import os
import sys
import ST7735
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
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont


import logging

from enviro_client import EnviroClient


logging.basicConfig(
    format='%(asctime)s.%(msecs)03d %(levelname)-8s %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S')

logging.info("""all-in-one.py - Displays readings from all of Enviro plus' sensors

Press Ctrl+C to exit!

""")

e_client = EnviroClient()

# BME280 temperature/pressure/humidity sensor
bme280 = BME280()

# PMS5003 particulate sensor
pms5003 = PMS5003()

# Create ST7735 LCD display class
st7735 = ST7735.ST7735(
    port=0,
    cs=1,
    dc=9,
    backlight=12,
    rotation=270,
    spi_speed_hz=10000000
)

# Initialize display
st7735.begin()

WIDTH = st7735.width
HEIGHT = st7735.height

# Set up canvas and font
img = Image.new('RGB', (WIDTH, HEIGHT), color=(0, 0, 0))
draw = ImageDraw.Draw(img)
path = os.path.dirname(os.path.realpath(__file__))
font = ImageFont.truetype(path + "/fonts/Asap/Asap-Bold.ttf", 20)

message = ""

# The position of the top bar
top_pos = 25


# Displays data and text on the 0.96" LCD
def display_text(variable, data, unit):
    # Maintain length of list
    values[variable] = values[variable][1:] + [data]
    # Scale the values for the variable between 0 and 1
    colours = [(v - min(values[variable]) + 1) / (max(values[variable])
               - min(values[variable]) + 1) for v in values[variable]]
    # Format the variable name and value
    message = "{}: {:.1f} {}".format(variable[:4], data, unit)
    logging.info(message)
    draw.rectangle((0, 0, WIDTH, HEIGHT), (255, 255, 255))
    for i in range(len(colours)):
        # Convert the values to colours from red to blue
        colour = (1.0 - colours[i]) * 0.6
        r, g, b = [int(x * 255.0) for x in colorsys.hsv_to_rgb(colour,
                   1.0, 1.0)]
        # Draw a 1-pixel wide rectangle of colour
        draw.rectangle((i, top_pos, i+1, HEIGHT), (r, g, b))
        # Draw a line graph in black
        line_y = HEIGHT - (top_pos + (colours[i] * (HEIGHT - top_pos)))\
                 + top_pos
        draw.rectangle((i, line_y, i+1, line_y+1), (0, 0, 0))
    # Write the text at the top in black
    draw.text((0, 0), message, font=font, fill=(0, 0, 0))
    st7735.display(img)


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

def output_header(f):
    output = ""
    for val in variables:
        if val == "collection_time":
            output += f"{val}"
        else:
            output += f"\t{val}"
    print(output, file=f)

def output_to_file(f, data):
    output = ""
    for val in variables:
        if val == "collection_time":
            output += f"{data[val].strftime('%Y-%m-%d %H:%M:%S')}"
        else:
            output += f"\t{data[val]}"
    print(output, file=f)

values = {}

for v in variables:
    values[v] = [1] * WIDTH

count = 0
# 100 approx every 5 mins
interval = 100
cumulative_variables = {}
for mode in range(1,len(variables)):
    cumulative_variables[variables[mode]] = 0.0

# The main loop
try:
    with open('readings.tsv', 'a') as outfile:
        output_header(outfile)
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
                    comp_factor = e_client.get_comp_factor(avg_cpu_temp, raw_temp)
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
            display_text(variables[disp_mode], data[variables[disp_mode]], units[disp_mode])
            output_to_file(outfile, data)

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
