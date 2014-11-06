var utils = require("../../../api/lib/utils");


describe("api/lib/utils validArrayJSON", function () {

  var fn = utils.validArrayJSON;

  it("Should return true if valid array with letters in each entry",
    function (done) {

    var valid = JSON.stringify(["one", "two"]);

    test.done(done, function () {
      expect(fn(valid)).to.be.true;
    });
  });

  it("Should throw if valid array but entry without letter(s)",
    function (done) {

    var invalid = JSON.stringify(["one", "  "]);
    var err;
    var result;

    try {
      result = fn(invalid);
    } catch (e) {
      err = e;
    } finally {
      test.done(done, function () {
        expect(result).to.be.undefined;
        expect(err).to.be.an.instanceof(Error);
      });
    }
  });

  it("Should throw if valid array but entry not a string",
    function (done) {

    var invalid = JSON.stringify(["one", 15]);
    var err;
    var result;

    try {
      result = fn(invalid);
    } catch (e) {
      err = e;
    } finally {
      test.done(done, function () {
        expect(result).to.be.undefined;
        expect(err).to.be.an.instanceof(Error);
      });
    }
  });

  it("Should throw if valid array but not entries",
    function (done) {

    var invalid = JSON.stringify([]);
    var err;
    var result;

    try {
      result = fn(invalid);
    } catch (e) {
      err = e;
    } finally {
      test.done(done, function () {
        expect(result).to.be.undefined;
        expect(err).to.be.an.instanceof(Error);
      });
    }
  });

  it("Should throw if not an array",
    function (done) {

    var invalid = JSON.stringify({ foo: "bar" });
    var err;
    var result;

    try {
      result = fn(invalid);
    } catch (e) {
      err = e;
    } finally {
      test.done(done, function () {
        expect(result).to.be.undefined;
        expect(err).to.be.an.instanceof(Error);
      });
    }
  });

});