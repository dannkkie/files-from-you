
# File From You

## Description

This project is a TypeScript Node.js monorepo that contains client, server, and dashboard projects.

Installation
To install the project, follow these steps:

Clone the repository to your local machine.
Navigate to the root directory of the project.
Run the following command to install all packages:

``` npm run install-all ```

Run the following command to start all projects:

``` npm run start ```

Usage
To use the project, follow these steps:

Open your web browser and navigate to http://localhost:3000 to access the Dashboard.
Use the API endpoints to interact with the server.
Docker
To set up RabbitMQ using Docker, run the following command:

``` docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management ```

To set up InfluxDB using Docker, run the following command:

``` docker run -d --name influxdb -p 8086:8086 -e INFLUXDB_ADMIN_USER=admin -e INFLUXDB_ADMIN_PASSWORD=admin123 -v influxdb_data:/var/lib/influxdb influxdb:2.7.4 ```