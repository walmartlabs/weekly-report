/**
 * Test utilities.
 */
module.exports = {

  /**
   * Convenience wrapper around `done` to properly bubble up test failures.
   */
  done: function (done, fn) {
    try {
      fn();
      done();
    } catch (err) {
      done(err);
    }
  }

};
