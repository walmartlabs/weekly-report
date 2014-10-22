
module.exports = function (server) {

  // Get existing survey
  server.route({
    method: "GET",
    path: "/surveys",
    handler: function (req, res) {
      res("HELLO WORLD!");
    }
  });
};
