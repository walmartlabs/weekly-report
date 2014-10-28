/**
* Utility functions.
 *
 * @type {Object}
 */

/**
 * Logs and responds to err from writing to DB.
 *
 * @param {object}  req   The Hapi request object
 * @param {object}  res   The Hapi response object
 * @param {object}  err   The err object resulting from failed write to DB
 * @param {string}  msg   The message to log and send with response
 */
var handleWriteErr = function (req, res, msg) {
  return function (err) {
    var errObj = {
      err: err,
      msg: msg
    };

    req.server.log("warning", errObj);
    res(errObj);
  };
};

module.exports = {
  handleWriteErr: handleWriteErr
};

