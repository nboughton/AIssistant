#!/bin/bash

if ! type docker; then
	echo "docker not found. Please install and configure docker and docker-compose before using this project"
	exit
fi

## Create docker volumes
docker volume create ollama
docker volume create mimic3
