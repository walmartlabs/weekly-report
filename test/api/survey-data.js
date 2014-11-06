/**
 * Some mock survey data.
 *
 * @exports {array}
 **/
var moment = require("moment");

module.exports =  [
  {
    periodStart: moment("20140101", "YYYYMMDD").toISOString(),
    periodEnd: moment("20140115", "YYYYMMDD").toISOString(),
    projectName: "Foo Project",
    creatorEmail: "creator@example.com",
    emails: [
      {
        email: "hi@example.com",
        name: "ExampleHi"
      },
      {
        email: "lo@example.com",
        name: "ExampleLo"
      }
    ]
  },
  {
    periodStart: moment("20140115", "YYYYMMDD").toISOString(),
    periodEnd: moment("20140130", "YYYYMMDD").toISOString(),
    projectName: "Bar Project",
    creatorEmail: "creator3@example.com",
    emails: [
      {
        email: "hi@example.com",
        name: "ExampleHi"
      },
      {
        email: "hilo@example.com",
        name: "ExampleHiLo"
      }
    ]
  }
];
