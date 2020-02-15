import logging
import json
from time import time

import boto3
from botocore.exceptions import EndpointConnectionError
from urllib3.exceptions import NewConnectionError
from requests.exceptions import ConnectionError

import requests


class EnviroClient():

    def __init__(self, serial_number, config):

            self.logger = logging.getLogger(__name__)

            self.serial_number = serial_number

            if 'api_key' in config:
                self.api_key = config['api_key']
            else:
                self.api_key = None
                self.appsync_api_id = config['appsync_api_id']
            self.appsync_api_endpoint = config['appsync_api_endpoint']
            self.api_expires = 0
            self.cached_api_key = None

    def get_api_key(self):

        if self.api_key:
            return self.api_key

        if not self.api_expires or self.api_expires < time():
            boto3_client = boto3.client('appsync')

            try:
                response = boto3_client.list_api_keys(apiId=self.appsync_api_id)
            except EndpointConnectionError as epce:
                self.logger.error(epce)
                return None

            self.cached_aput_key = None
            for api_key in response['apiKeys']:
                if api_key['expires'] > time():
                    self.api_expires = api_key['expires']
                    self.cached_api_key = api_key['id']
                    break

            if not self.cached_api_key:
                new_key = boto3_client.create_api_key(apiId=self.appsync_api_id)
                self.logger.debug(new_key)
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
            self.logger.error(nce)
        except ConnectionError as ce:
            self.logger.error(ce)

        return response

    def upload_values(self, data):

        query = '''mutation createReading { createReading(input: { ''' + f'''collection_time: \"{data["collection_time"].isoformat()}Z\",
        temperature: {data["temperature"]}, raw_temperature: {data["raw_temperature"]}, comp_factor: {data["comp_factor"]}, pressure: {data["pressure"]}, humidity: {data["humidity"]},
                light: {data["light"]}, oxidised: {data["oxidised"]}, reduced: {data["reduced"]}, nh3: {data["nh3"]},
                pm1: {data["pm1"]}, pm25: {data["pm25"]}, pm10: {data["pm10"]},
                monitorID: \"{self.serial_number}\"''' + '''}){collection_time, temperature}}'''
        resp = self.execute_gql(query)
        if resp:
            self.logger.info(resp.status_code)
            self.logger.info(resp.content)
