/**
 * Some mock survey data.
 *
 * @exports {array}
 **/
var moment = require("moment");

module.exports =  [
  {
    periodStart: moment("20140101", "YYYYMMDD"),
    periodEnd: moment("20140115", "YYYYMMDD"),
    projectName: "Foo Project",
    projectId: "1654564",
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
    periodStart: moment("20140115", "YYYYMMDD"),
    periodEnd: moment("20140130", "YYYYMMDD"),
    projectName: "Bar Project",
    projectId: "54654654",
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
