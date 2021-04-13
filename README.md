### Directions Service

A web-service, based on NodeJS, Express and Google Directions API to generate routes for your system, integrated with quota control system.
The user's quota is programmed to be renewed by one day of month, with a schedule running in background.

## Requirements:
* NodeJS >=10.0.0
* MongoDB

## Environments Variables

* MONGO_URL (full url to connect to MONGODB -- default: `localhost:27017`)
* JWT_ADMIN_SECRET (Secret signs for JWT token) 
* JWT_SYSTEM_SECRET (Secret signs for JWT token)
* JWT_USER_SECRET (Secret signs for JWT token)

`I strongly recommend to change the secrets`

## Google Directions API

To use the system, you need to generate API Keys on Google Directions API (https://developers.google.com/maps/documentation/directions/overview)
to be able to use the system.

## Available endpoints

The available endpoints are listed on the file `examples.http` to create systems, update its properties and manage users to use it.

## Responses examples

The response examples are listed on `example_complete_response.json` and `example_simple_response.json`.