#!/bin/bash

sleep 5

/usr/bin/paplay --volume=50000 /usr/share/sounds/ubuntu/stereo/desktop-login.ogg &

sleep 3

Exec=nohup http-server ./dashboard -o &

