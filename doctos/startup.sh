#!/bin/bash

sleep 5

/usr/bin/paplay --volume=50000 /usr/share/sounds/ubuntu/stereo/desktop-login.ogg &

sleep 3

Exec=nohup java -Dlog4j.configuration=file:./dashboard/sistema/cfg/log4j.properties -jar ./dashboard/sistema/xBeeMqttEneeyes-0.0.1-SNAPSHOT-jar-with-dependencies.jar 177.144.134.145 /dev/ttyUSB0 &

