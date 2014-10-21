/**
 * Test setup.
 */

// Expose test globals
var chai = require("chai");
var request = require("supertest");
var sinonChai = require("sinon-chai");

chai.use(sinonChai);

global.sinon = require("sinon");
global.expect = chai.expect;
