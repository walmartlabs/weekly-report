var _ = require("lodash");
var liveServer = require("../../server-single");

// A batch of surveys to mock with
var testSurveys = require("../survey-data");

describe("api/sql-models", function () {

  var server;

  // Get a surver instance
  before(function (done) {
    liveServer()
      .done(function (serverRef) {
        server = serverRef;
        done();
      });
  });

  // Shut down server
  after(function (done) {
    server.stop(done);
  });

  describe("foreign key constraints", function () {
    var data;
    var err;

    // Write survey without BatchId
    before(function (done) {
      var models = server.plugins.sqlModels.models;

      models.Survey.create(_.omit(testSurveys[0], "emails", "BatchId"))
        .done(function (error, theData) {
          err = error;
          data = theData;
          done();
        });
    });

    it("should err if write survey record without foreign key BatchId",
      function () {

      expect(err).to.be.an("object");
      expect(err.name).to.equal("SequelizeValidationError");
    });
  });
});
