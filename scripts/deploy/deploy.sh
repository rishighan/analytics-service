#!/bin/bash
# My first script

echo "Attempting to create analytics-service folder"
echo "---"

if [ ! -d "analytics_service_compose_config" ]
then
    echo "Directory doesn't exist. Creating now..."
    mkdir analytics_service_compose_config
    echo "as_deploy created."
else
    echo "analytics_service_compose_config already exists. Removing and recreating..."
    rm -Rf analytics_service_compose_config
    mkdir analytics_service_compose_config
    echo "Directory created."
    
fi
    cd analytics_service_compose_config
    echo "Changed directory to analytics_service_compose_config"
    
    echo "Downloading the docker-compose configuration for Analytics Service..."
    curl https://raw.githubusercontent.com/rishighan/analytics-service/master/Dockerfile --output Dockerfile
    curl https://raw.githubusercontent.com/rishighan/analytics-service/master/docker-compose.yml --output docker-compose.yml
    curl https://raw.githubusercontent.com/rishighan/analytics-service/master/docker-compose.env --output docker-compose.env

    echo "Pulling the relevant Docker images..."
    docker-compose pull

    echo "Starting images..."
    docker-compose up
