#!/bin/bash
# Rishi Ghan
# Deployment script for analytics-service

# usage: ./deploy.sh [config_directory] [service-name]

cat >> ~/.ssh/config  << EOF
VerifyHostKeyDNS yes
StrictHostKeyChecking no
EOF

echo "Attempting to create configuration folder..."

directory_name=$1
service_name=$2

if [ ! -d "$directory_name" ]
then
    echo "Directory doesn't exist. Creating now..."
    mkdir "$directory_name"
    echo "$directory_name created."
else
    echo "$directory_name already exists. Removing and recreating..."
    rm -Rf "$directory_name"
    mkdir "$directory_name"
    echo "Done."
    
fi
    echo "Changing directory to $directory_name"
    cd "$directory_name"

    echo "Docker environment reset:"
    echo "Housekeeping..."
    docker system prune -f

    echo "Stopping and removing containers and volumes..."
    docker-compose down -v

    echo "Downloading the docker-compose configuration for Analytics Service..."
    curl https://raw.githubusercontent.com/rishighan/analytics-service/master/Dockerfile --output Dockerfile
    curl https://raw.githubusercontent.com/rishighan/analytics-service/master/docker-compose.yml --output docker-compose.yml
    curl https://raw.githubusercontent.com/rishighan/analytics-service/master/docker-compose.env --output docker-compose.env

    echo "Pulling the relevant Docker images..."
    docker-compose pull

    echo "Starting images..."
    docker-compose up 
