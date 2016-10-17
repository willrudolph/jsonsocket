/*jslint node:true */
"use strict";
var _log = require('../utils/logger.js').getLogger(__filename);

function Client() {
    this.socket = null;
    this.id = null;
    this.accessPaths = [];
    this.info = {};
}




exports.getClient = function () {
    _log("getClient");
    return new Client();
};