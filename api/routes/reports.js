


module.exports = function (server) {

  // Create new survey
  server.route({
    method: "POST",
    path: "/surveys/create",
    handler: function (req, res) {

      global.console.log(req.body);
      res("HELLO WORLD!");
    }
  });

  // Get existing survey
  server.route({
    method: "GET",
    path: "/surveys/get",
    handler: function (req, res) {
      res("HELLO WORLD!");
    }
  });
};
