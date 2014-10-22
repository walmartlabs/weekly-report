
var server = require("../../../api/server");

describe("api/routes/reports", function () {

  it("should get string at /reports/get", function (done) {
    server.inject({
      method: "GET",
      url: "/surveys"
    }, function (res) {
      test.done(done, function () {
        expect(res.statusCode).to.equal(200);
      });
    });
  });
});
