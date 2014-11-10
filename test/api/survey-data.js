/**
 * Some mock survey data.
 *
 * @exports {array}
 **/
module.exports =  [
  {
    periodStart: "20140101",
    periodEnd: "20140115",
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
    periodStart: "20140115",
    periodEnd: "20140130",
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
