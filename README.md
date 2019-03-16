# My MongoDB IoT Talk - Kinda Reloaded...

This is a rehash of a talk I did at the MongoDB User Group Mannheim in 2015.
This time reloaded with more fancy stuff like Angular, NestJS and Nyancat.

**TODO**: Schema needs optimization as outlined in MongoDB Whitepaper "Time Series Data and MongoDB: Best
Practices Guide".

## Getting Started

Instructions for getting up and running ;)

### Prerequisites

To build and run these project the following prerequisites must be met:

* Node.js in at least v8.10.0
* Globally installed Typescript compiler in at least v3.1.6.
* Basic familiarity with Node.js & NPM, Angular and NestJS is helpful.
* Running MongoDB instance at least in version 3.4.

### Package Overview

The whole project is self-contained in this monorepo using Lerna.

It consists of the following packages:

* **api**: NestJS API providing a RESTful interface for mean acceleration statistics and WebSocket interface for data push.
* **data-mock**: Replay tool for mocking of data.
* **mobile-sensor-app**: Mobile Sensor App written in Angular which pushes device orientation and acceleratio to API.

### Build Instructions

#### api

In order to build the API, navigate into folder `packages/api`.
Install NPM dependencies by invoking `npm i`.

#### data-mock

In order to build the Data Replay Tool, navigate into folder `packages/data-mock`.
Install NPM dependencies by invoking `npm i`.
Build project by invoking `npm run build`.

**Note:** `rimraf` needs to be installed beforehand, to do so invoke `npm i -g rimraf`.

#### mobile-sensor-app

In order to build the API, navigate into folder `packages/mobile-sensor-app`.
Install NPM dependencies by invoking `npm i`.

### Usage Instructions

#### api

You may run the `api` project by invoking `npm start` to serve it locally using NestJS.

By default the local dev server will start on port 3000.
Swagger API Documentation is provided by NestJS Swagger plugin on endpoint `/swagger`.

**Note:** MongoDB instance needs to be running beforehand.

#### data-mock

You may start the project by invoking `npm run`.
After start, the Data Replay Tool will ask for confirmation before sending mock data.
Enter "y" or "Yes" to do so or cancel by doing otherwise.

**Note:** MongoDB instance needs to be running beforehand, collection `sensorDataMock`.

#### mobile-sensor-app

You may run the `mobile-sensor-app` project by invoking `ng s -o --host 0.0.0.0` to serve the app using the Angular Dev Server network-wide.
By default the local dev server will start on port 4200.

To use the app on a mobile device in the same network, adjust the configuration residing in file `./shared/config.const.ts` and open the app using the browser on the device (tested with Android so far).

A small statistics visualisation for mean acceleration is available by navigating to '/statistics'.

## License

This project is licensed under the terms of the **MIT** license, see `LICENSE` to check out the full license.