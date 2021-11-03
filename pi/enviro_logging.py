import logging
from time import time

from logging.handlers import TimedRotatingFileHandler

class EnviroLogging():

    def __init__(self, serial_number, config):
        try:

            self.serial_number = serial_number

            self.logger = logging.getLogger(__name__)
            self.logger.setLevel(logging.INFO)

            if 'logfile' in config:
                self.logfile = config['logfile']
            else:
                self.logfile = 'enviro_log.log'

            logging.basicConfig(
                format='%(asctime)s %(message)s',
                level=logging.INFO,
                datefmt='%Y-%m-%d %H:%M:%S')

            if 'log_interval' in config:
                self.log_interval = config['log_interval']
                handler = TimedRotatingFileHandler(self.logfile,
                                                   when=self.log_interval,
                                                   backupCount=0)
                self.logger.addHandler(handler)
            else:
                handler = FileHandler(self.logfile)
                self.logger.addHandler(handler)

            # Don't output to console
            self.logger.propagate = False


        except FileNotFoundError as fnfe:
            print('environ_config.json not found')

    # Get Raspberry Pi serial number to use as ID                                                                                                                                                                                                                                                   
    def get_serial_number(self):
        with open('/proc/cpuinfo', 'r') as f:
            for line in f:
                if line[0:6] == 'Serial':
                    return line.split(":")[1].strip()

    def output_header(self, variables):
        output = ""
        for val in variables:
            if val == "collection_time":
                output += f"{val}"
            else:
                output += f"\t{val}"
        self.logger.info(output)


    def output_to_file(self, variables, data):
        output = ""
        for val in variables:
            if val == "collection_time":
                output += f"{data[val].strftime('%Y-%m-%d %H:%M:%S')}"
            else:
                if val in data:
                    output += f"\t{data[val]}"
                else:
                    output += "\t-1"

        self.logger.info(output)
