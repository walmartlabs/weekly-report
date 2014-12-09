var path = require("path");

var register = function (plugin, options, next) {
  // Add static routes
  plugin.route({
    method: "GET",
    path: "/assets/fonts/{param*}",
    handler: {
      directory: {
        path: path.resolve(__dirname, "../../node_modules/font-awesome")
      }
    }
  });

  plugin.route({
    method: "GET",
    path: "/assets/images/{param*}",
    handler: {
      directory: {
        path: path.resolve(__dirname, "../../app/assets/images")
      }
    }
  });

  plugin.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: path.resolve(__dirname, "../../build")
      }
    }
  });

  next();
};

register.attributes = {
  name: "staticRoutes"
};

module.exports = {
  register: register
};
