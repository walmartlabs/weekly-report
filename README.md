***
# NOTICE:

## This repository has been archived and is not supported.

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)
***
NOTICE: SUPPORT FOR THIS PROJECT HAS ENDED 

This projected was owned and maintained by Walmart. This project has reached its end of life and Walmart no longer supports this project.

We will no longer be monitoring the issues for this project or reviewing pull requests. You are free to continue using this project under the license terms or forks of this project at your own risk. This project is no longer subject to Walmart's bug bounty program or other security monitoring.


## Actions you can take

We recommend you take the following action:

  * Review any configuration files used for build automation and make appropriate updates to remove or replace this project
  * Notify other members of your team and/or organization of this change
  * Notify your security team to help you evaluate alternative options

## Forking and transition of ownership

For [security reasons](https://www.theregister.co.uk/2018/11/26/npm_repo_bitcoin_stealer/), Walmart does not transfer the ownership of our primary repos on Github or other platforms to other individuals/organizations. Further, we do not transfer ownership of packages for public package management systems.

If you would like to fork this package and continue development, you should choose a new name for the project and create your own packages, build automation, etc.

Please review the licensing terms of this project, which continue to be in effect even after decommission.


# Weekly Reports
A survey tool.

## Using the package API

#### Install

```npm install walmartlabs/weekly-report```

#### Setup

Define the following fields with environmental variables or in the options object. See Sequelize documentation for more information. Defaults to an in-memory `sqlite` instance but is also setup to use `mysql`.

```
database: process.env.DATABASE || options.database || "",
user: process.env.DATABASE_USER || options.user || "",
pass: process.env.DATABASE_PASS || options.pass || "",
dialect: process.env.DATABASE_DIALECT || options.dialect || "sqlite",
storage: process.env.DATABASE_STORAGE || options.storage || null,
```
For example, the following environmental variables are used in Travis CI for `mysql`
`DATABASE=app_test DATABASE_USER=root DATABASE_DIALECT=mysql`

Define the server PORT:  `process.env.PORT`

#### Usage

Package exports an object with properties:

```
server        {object}    The Hapi server instance with routes, logger and sqlize loaded
createTables  {function}  Calls and returns Sequelize sync method to create sql tables.
                          Returns a promise.
```

Example Usage:

```
var serverPromise = require("weekly-report");
var server;

serverPromise(options)
  .then(function (result) {
	server = result.server;

	// Create sql tables if they don't exist
	// Returns promise
	return result.createTables();
  })
  .done(function () {
  	server.start(function () {
  	  console.log("server started");
  	});
  });
```

See more examples in the server files found at `./test/`
## Using the Server API

#### Create new batch of surveys

`POST surveys/batch`

Accepts on array of survey objects.

Parameters:

```
periodStart    {string}    "YYYYMMDD"  Start date of survey period.
periodEnd      {string}    "YYYYMMDD"  End date of survey period.
projectId      {string}    User supplied project identifier
projectName    {string}    Name of the project.
creatorEmail   {string}    Email address of creator of surveys.
emails:        {object[]}  Array of email objects of survey participants. Of form:
```

Email objects of form:
```
{
  name: "John Doe".
  email: "john.doe@example.com"
}
```

Example Request:

```
curl -vs -XPOST -H"content-type: application/json" -d'[{"periodStart":"20141110","periodEnd":"20141117","projectId":"33", "projectName":"project-review","creatorEmail":"foo@example.org","emails":[{"name": "John Doe", "email": "john.doe@example.com"}]}]' http://localhost:8000/surveys/batch
```
Example Reponse:

```
{
  "surveys": [
    {
      "id": 5,
      "periodStart": "20141110",
      "periodEnd": "20141117",
      "creatorEmail": "foo@exmaple.org",
      "projectName": "project-review",
      "projectId": "33",
      "SurveyBatchId": 4,
      "createdAt": "2014-11-18T23:28:15.000Z",
      "updatedAt": "2014-11-18T23:28:15.000Z",
      "Responses": [
        {
          "accomplishments": null,
          "blockers": null,
          "id": 7,
          "token": "a601f4ab1fb91b1",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "completedAt": null,
          "moralePicker": null,
          "privateFeedback": null,
          "SurveyId": 5,
          "createdAt": "2014-11-18T23:28:15.000Z",
          "updatedAt": "2014-11-18T23:28:15.000Z"
        }
      ]
    }
  ],
  "tokensByEmail": [
    {
      "email": "john.doe@example.com",
      "name": "John Doe",
      "tokens": [
        "a601f4ab1fb91b1"
      ]
    }
  ],
  "batchId": 4
}
```

#### Get batch of surveys with responses

`GET /surveys/batch/{number}`

Parameters:

```
number                       Id number of the batch to get records for.
```

Example request:

```
curl http://localhost:8000/surveys/batch/4
```

Will return same response as batch POST above.

#### Get survey response form for participant to fill out.

`GET /responses/{tokens}`

Parameters:

```
tokens:                    A '...' separated list of response tokens.
```

Example Request:

```
curl http://localhost:8000/response/a601f4ab1fb91b1
```

Will return survey participant to complete.

#### Post survey response form**

** Note that the survey response form handles this.

`POST /responses`

Parameters:

```
token:            {string}    The response tocken
accomplihsments   {string[]}  Accomplishments
blockers          {string[]}  Blockers
moralePicker      {string}    Result of morale picker.
privateFeedback   {string}    Private feedback.

```

Example Request:

```
curl -vs -XPOST -H"content-type: application/json" -d'{"token":"a601f4ab1fb91b1","accomplishments":["accomplished this","accomplished that"]}' http://localhost:8000/responses
```

Example Reponse:

```
{
  "accomplishments": [
    "accomplished this",
    "accomplished that"
  ],
  "blockers": null,
  "id": 7,
  "token": "a601f4ab1fb91b1",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "completedAt": "2014-11-18T23:54:15.277Z",
  "moralePicker": null,
  "privateFeedback": null,
  "SurveyId": 5,
  "createdAt": "2014-11-18T23:28:15.000Z",
  "updatedAt": "2014-11-18T23:54:15.000Z"
}
```


## API Development

### Dev Server

`gulp server:dev` - runs dev server with nodemon

### Dev for server generated responses view

`gulp start` - loads database with mock data and launches browser to view
responses for one user. Uses livereload!

## Testing

`gulp check` - runs jshint, jscs, and mocha tests

[![Build Status][trav_img]][trav_site]

[trav_img]: https://travis-ci.org/walmartlabs/weekly-report.svg
[trav_site]: https://travis-ci.org/walmartlabs/weekly-report
