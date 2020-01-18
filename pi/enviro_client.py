import json
import os
import logging
from time import time

import boto3
from botocore.exceptions import EndpointConnectionError
from urllib3.exceptions import NewConnectionError
from requests.exceptions import ConnectionError

import requests

CONFIG_FILE = 'enviro_config.json'

class EnviroClient():

    def __init__(self):
        try:

            self.serial_number = self.get_serial_number()

            dir_path = os.path.dirname(os.path.realpath(__file__))
            with open(os.path.join(dir_path,CONFIG_FILE)) as config_file:
                config = json.load(config_file)

                self.comp_factor = config['comp_factor']
                self.calibrate = False
                if 'calibrate' in config:
                    self.calibrate = config['calibrate']
                    self.target_temp = config['target_temp']
                    # Allow time to stabilize
                    self.calibrate_countdown = 70

                if 'api_key' in config:
                    self.api_key = config['api_key']
                else:
                    self.api_key = None
                    self.appsync_api_id = config['appsync_api_id']
                    self.appsync_api_endpoint = config['appsync_api_endpoint']
                self.api_expires = 0
                self.cached_api_key = None
        except FileNotFoundError as fnfe:
            print('environ_config.json not found')

    # Get Raspberry Pi serial number to use as ID                                                                                                                                                                                                                                                   
    def get_serial_number(self):
        with open('/proc/cpuinfo', 'r') as f:
            for line in f:
                if line[0:6] == 'Serial':
                    return line.split(":")[1].strip()

    def get_api_key(self):

        if self.api_key:
            return self.api_key

        if not self.api_expires or self.api_expires < time():
            boto3_client = boto3.client('appsync')

            try:
                response = boto3_client.list_api_keys(apiId=self.appsync_api_id)
            except EndpointConnectionError as epce:
                logging.error(epce)
                return None

            self.cached_aput_key = None
            for api_key in response['apiKeys']:
                if api_key['expires'] > time():
                    self.api_expires = api_key['expires']
                    self.cached_api_key = api_key['id']
                    break

            if not self.cached_api_key:
                new_key = boto3_client.create_api_key(apiId=self.appsync_api_id)
                print(new_key)
                self.cached_api_key = new_key['id']
                self.api_expires = new_key['expires']
                return(new_key['id'])

        return self.cached_api_key

    def execute_gql(self, query):
        headers = {
            'Content-Type': "application/graphql",
            'x-api-key': self.get_api_key(),
            'cache-control': "no-cache",
        }

        payload_obj = {"query": query}
        payload = json.dumps(payload_obj)
        response = None
        try:
            response = requests.request("POST", self.appsync_api_endpoint, data=payload, headers=headers)
        except NewConnectionError as nce:
            logging.error(nce)
        except ConnectionError as ce:
            logging.error(ce)

        return response

    def upload_values(self, data):

        query = '''mutation createReading { createReading(input: { ''' + f'''collection_time: \"{data["collection_time"].isoformat()}Z\",
        temperature: {data["temperature"]}, raw_temperature: {data["raw_temperature"]}, comp_factor: {data["comp_factor"]}, pressure: {data["pressure"]}, humidity: {data["humidity"]},
                light: {data["light"]}, oxidised: {data["oxidised"]}, reduced: {data["reduced"]}, nh3: {data["nh3"]},
                pm1: {data["pm1"]}, pm25: {data["pm25"]}, pm10: {data["pm10"]},
                monitorID: \"{self.serial_number}\"''' + '''}){collection_time, temperature}}'''
        resp = self.execute_gql(query)
        if resp:
            logging.info(resp.status_code)
            logging.info(resp.content)

    def get_comp_factor(self, avg_cpu_temp, raw_temp):
        # 
        if self.calibrate:
            if self.calibrate_countdown > 0:
                self.calibrate_countdown -= 1
                return self.comp_factor
            calc_comp_factor = (avg_cpu_temp - raw_temp) / (raw_temp - self.target_temp)
            new_comp_temp = raw_temp - ((avg_cpu_temp - raw_temp) / calc_comp_factor)
            print(f'{calc_comp_factor} raw {raw_temp} avg_cpu {avg_cpu_temp} new_comp {new_comp_temp}')
            self.comp_factor = float("{:.2f}".format(calc_comp_factor))
            self.calibrate = False
            # Make sure calibration only happens once and new settings are
            # saved for next restart
            config = {}
            with open(CONFIG_FILE, 'r') as config_file:
                config = json.load(config_file)
            with open(CONFIG_FILE, 'w') as config_file:
                config['calibrate'] = False
                config['comp_factor'] = calc_comp_factor
                json.dump(config, config_file, indent=4)

        return self.comp_factor

