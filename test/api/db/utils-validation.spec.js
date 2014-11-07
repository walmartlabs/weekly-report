var utils = require("../../../api/lib/utils");


describe("api/lib/utils validArrayJSON", function () {

  var fn = utils.validArrayJSON;

  it("Should return true if valid array with letters in each entry",
    function () {

    var valid = {
      value: JSON.stringify(["one", "two"])
    };

    expect(fn(valid)).to.be.true;
  });

  it("Should return true if empty array and allowEmpty: true",
    function () {

    var valid = {
      value: JSON.stringify([]),
      allowEmpty: true
    };

    expect(fn(valid)).to.be.true;
  });

  it("Should throw if valid array but entry without letter(s)",
    function () {

    var invalid = {
      value: JSON.stringify(["one", "  "])
    };

    var err;
    var result;

    try {
      result = fn(invalid);
    } catch (e) {
      err = e;
    } finally {
      expect(result).to.be.undefined;
      expect(err).to.be.an.instanceof(Error);
    }
  });

  it("Should throw if valid array but entry not a string",
    function () {

    var invalid = {
      value: JSON.stringify(["one", 15])
    };

    var err;
    var result;

    try {
      result = fn(invalid);
    } catch (e) {
      err = e;
    } finally {
      expect(result).to.be.undefined;
      expect(err).to.be.an.instanceof(Error);
    }
  });

  it("Should throw if valid array but not entries",
    function () {

    var invalid = {
      value: JSON.stringify([])
    };
    var err;
    var result;

    try {
      result = fn(invalid);
    } catch (e) {
      err = e;
    } finally {
      expect(result).to.be.undefined;
      expect(err).to.be.an.instanceof(Error);
    }
  });

  it("Should throw if not an array",
    function () {

    var invalid = {
      value: JSON.stringify({ foo: "bar" })
    };
    var err;
    var result;

    try {
      result = fn(invalid);
    } catch (e) {
      err = e;
    } finally {
      expect(result).to.be.undefined;
      expect(err).to.be.an.instanceof(Error);
    }
  });

});
