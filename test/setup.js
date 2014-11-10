/**
 * Test setup.
 */

// Expose test globals
var chai = require("chai");
var sinonChai = require("sinon-chai");
var test = require("./lib/utils");
chai.use(sinonChai);

global.sinon = require("sinon");
global.expect = chai.expect;
global.test = test;

// Set to 'test' which will stop logging
process.env.NODE_ENV = "test";
