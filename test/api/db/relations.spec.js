var _ = require("lodash");
var getServer = require("../../../api/server");

// A batch of surveys to mock with
var testSurveys = require("../survey-data");

describe("api/sql-models", function () {

  var server;

  // Get a surver instance
  before(function (done) {
    getServer(null, function (err, serverRef) {
      if (err) { return done(err); }

      server = serverRef;
      server.start(done);
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
