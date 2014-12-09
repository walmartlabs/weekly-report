var responseRoutes = require("../routes/responses");
var surveyRoutes = require("../routes/surveys");

var register = function (plugin, options, next) {
  responseRoutes(plugin, options);
  surveyRoutes(plugin);

  next();
};

register.attributes = {
  name: "routes"
};

module.exports = {
  register: register
};
