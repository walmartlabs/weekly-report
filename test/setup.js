/**
 * Test setup.
 */

// Expose test globals
var sinonChai = require("sinon-chai");
var chai = require("chai");
chai.use(sinonChai);

global.sinon = require("sinon");
global.expect = chai.expect;
