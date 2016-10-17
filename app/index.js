/**
 * Created by wr198j on 6/16/2016.
 */
/*jslint node:true */
"use strict";

var _ = require('lodash'),
    appLog = require('./utils/logger.js'),
    _log = require('./utils/logger.js').getLogger(__filename),
    options = require("./utils/options.js"),
    config = require("./utils/options.js").config,
    utils = require("./utils/utils.js"),
    interfaces = require('./interfaces/interfaces.js'),
    dataManager = require("./data/data-manager.js"),
    comms = require("./comms/communications.js");


function updateConfig(newConfig) {
    config = utils.subObjectReplace(newConfig, config);
}


module.exports = {
    start : function (jsonFile, newConfig, callbacks) {
        // end functions if started
        // updates config
        updateConfig(newConfig);
        _log('check');
        // input json into data mirror
        dataManager.init(jsonFile, config.data_manager);
        comms.init(config.comms);
        // sets up callbacks
        interfaces.init(config.interfaces);
        this.end();
    },
    getCurOptions : function () {
        // returns current config for reference
        return config;
    },
    currentJSON: function () {
        return dataManager.read.lastJSON();
    },
    end : function () {
        _log("shutdown", 0);
    },
    check : function () {
        return "BOB CHECKS!";
    }
}


