# Weekly Reports
A survey tool.

## Using the API

#### Create new batch of surveys

`POST surveys/batch`

Accepts on array of survey objects.

Parameters:

```
periodStart    {string}    "YYYYMMDD"  Start date of survey period.  
periodEnd      {string}    "YYYYMMDD"  End date of survey period.  
projectName    {string}    Name of the project.  
creatorEmail   {string}    Email address of creator of surveys.  
emails:        {string[]}  Array of email addresses of survey participants.  
```

#### Get batch of surveys with responses

`GET /surveys/batch/{number}`

Parameters:

```
number                     Id number of the batch to get records for.
```

#### Get survey response form for participant to fill out.

`GET /responses/{tokens}`

Parameters:

```
tokens:        {string}   A '...' separated list of response tokens.  
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

[trav_img]: https://magnum.travis-ci.com/walmartlabs/weekly-report.svg?token=ZfFWk5tb9YseEiCpgoy2
[trav_site]: https://magnum.travis-ci.com/walmartlabs/weekly-report
