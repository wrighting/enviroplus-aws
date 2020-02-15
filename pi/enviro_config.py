import logging
import json
import os

class EnviroConfig():

    def __init__(self, serial_number, config_file):

        self.logger = logging.getLogger(__name__)

        self.serial_number = serial_number
        self.config_file = config_file

        dir_path = os.path.dirname(os.path.realpath(__file__))

        with open(os.path.join(dir_path, config_file)) as config_fp:
            self.config = json.load(config_fp)

        self.comp_factor = self.config['comp_factor']
        self.calibrate = False
        if 'calibrate' in self.config:
            self.calibrate = self.config['calibrate']
            self.target_temp = self.config['target_temp']
            # Allow time to stabilize
            self.calibrate_countdown = 70


    def get_config(self):
        return self.config

    def get_comp_factor(self, avg_cpu_temp, raw_temp):
        # 
        if self.calibrate:
            if self.calibrate_countdown > 0:
                self.calibrate_countdown -= 1
                return self.comp_factor
            calc_comp_factor = (avg_cpu_temp - raw_temp) / (raw_temp - self.target_temp)
            new_comp_temp = raw_temp - ((avg_cpu_temp - raw_temp) / calc_comp_factor)
            self.logger.debug(f'Recalcuating comp_factor {calc_comp_factor} raw {raw_temp} avg_cpu {avg_cpu_temp} new_comp {new_comp_temp}')
            self.comp_factor = float("{:.2f}".format(calc_comp_factor))
            self.calibrate = False
            # Make sure calibration only happens once and new settings are
            # saved for next restart
            config = {}
            with open(self.config_file, 'r') as config_file:
                config = json.load(config_file)
            with open(self.config_file, 'w') as config_file:
                config['calibrate'] = False
                config['comp_factor'] = calc_comp_factor
                self.config = config
                json.dump(config, config_file, indent=4)

        return self.comp_factor

