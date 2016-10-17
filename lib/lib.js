/**
 * Created by wr198j on 6/16/2016.
 */
/*jslint node:true */
"use strict";

var _ = require('lodash'),
    path = require('path'),
    fs = require('fs');

function LoadJsonFile(fileNameWithPath, onCompleteFnc) {
    var fileObj;

    fs.readFile(fileNameWithPath, 'utf8', function (err, data) {

        if (err) {
            // report error
            throw err;
        }

        try {
            fileObj = JSON.parse(data);
        } catch (jsonParseErr) {
            // report error on json parse
            throw jsonParseErr;
        }

        onCompleteFnc(fileObj);
    });
}

function optionsParse(object) {
    var rtnOptions = {};
    _.each(object, function (item) {
        var eqIdx;
        if (item.indexOf("--") === 0) {
            eqIdx = item.indexOf("=");
            if (eqIdx !== -1) {
                rtnOptions[item.substr(2, eqIdx - 2)] = item.substr(eqIdx + 1);
            }
        }
    })
    return rtnOptions;
}

module.exports = {
    optionsParse : optionsParse,
    loadJson : LoadJsonFile
}