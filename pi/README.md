
Install the library from https://github.com/pimoroni/enviroplus-python as per
the instructions.

You'll need to copy the fonts directory from that repo.

The paths in all-in-one.py and enviro.service assume that this has been cloned
under /home/pi

In /home/pi/enviroplus-aws/pi create a virtualenv called enviro-env and install the requirements using pip3 as normal.

Copy enviro_config.json.template to enviro_config.json and edit as appropriate
- you will probably need to set up the amplify part first to get the settings

To test you can now just run ```all-in-one.py```

If you want to run as a systemd service then copy enviro.service to /etc/systemd/system/enviro.service and
run ```systemctl daemon-reload``` followed by ```systemctl start enviro```

As well as logging results to the DynamoDb at intervals, a finer grained set of
readings will be captured in the file readings.tsv (in / if you are using
systemd)
