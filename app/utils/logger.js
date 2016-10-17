/**
 * Created by wr198j on 6/17/2016.
 *
 * Generic Javascript logger for Node.js and JS
 * Includes MINOR Node JS code
 *
 */

/*jslint
 es6, node
 */

"use strict";
var _ = require('lodash'),
    os = require("os"),
    loggers = [],
    startTime = os.uptime(),
    _shortTrace = false,
    _singleCheck,
    _globalTraceLvl = 5,// default
    _prodMode = false; // default

const ECODES = [
    "CRIT ",
    "Error",
    "Warn ",
    "Comm ",
    "Debug",
    "Trace"
];



function getTime(){
    return Math.round((os.uptime() - startTime)*1000)
}


function replaceArgs(){
    var args = Array.from(arguments),
        rtnMessage = args[0],
        i = 0,
        len;

    if (_.isArray(args[0])){
        args = args[0];
        rtnMessage = args[0];
    }
    if (!_.isString(rtnMessage)){
        return;
    }

    args.shift();
    len = args.length;

    for (; i < len; i += 1){
        rtnMessage = rtnMessage.replace(new RegExp("\\{"+ i +"\\}", "g"), args[i]);
    }

    return rtnMessage;
}


function LogDetail(message, level, time, fromModule) {
    this.message = message;
    this.level = level;
    this.time = time;
    this.fromModule = fromModule;
}

LogDetail.prototype.makeString = function (shortTrace) {

    var asString = String(this.time),
        shortTrace = shortTrace || false;

    while (asString.length < 6){
        asString = "0" + asString;
    }

    var tBuild= (!shortTrace) ? asString : "| ";
    tBuild += (!shortTrace) ? ("| " + ECODES[Number(this.level)]) : String(this.level);
    tBuild += " [" + this.fromModule + "]:";
    tBuild += this.message;

    return tBuild;
}




function DevLogger(name) {
    var lastIdx = (name.lastIndexOf("\\") === -1) ? 0 : name.lastIndexOf("\\") + 1;
    this.fileName = name.substring(lastIdx);
    this.debugLvl = 5;
}

DevLogger.getNew = function (name) {
    return new DevLogger(name);
}

DevLogger.prototype.log = function (){
    var args = Array.from(arguments),
        dfLevel = this.debugLvl,
        message,
        lastArg,
        logDetail,
        firstVal = args[0];
    if (_globalTraceLvl === 0 || this.debugLvl === 0 || args.length === 0 || !args) {
        return;
    }

    if (_.isString(firstVal) && args.length === 1){
        message = firstVal;
    } else if (_.isNumber(firstVal) && (args.length === 1)) {
        // critical important error
        message = CRITICAL + ":# " + firstVal;
    } else if (args.length > 1){
        // First is message - last is level if number
        // middle are replacement values
        message = args[0];
        args.shift();
        if (args.length === 1){
            if (message.indexOf('{0}') !== -1) {
                message = replaceArgs(message, args[0]);
            } else {
                dfLevel = args[0];
            }
        } else if (args.length > 1) {
            lastArg = args.length - 1;
            if (message.indexOf("{" + lastArg + "}") !== -1) {
                args.unshift(message);
                message = replaceArgs.apply(this, args);
            } else {
                // assume last arg is level
                dfLevel = args.pop();
                args.unshift(message);
                message = replaceArgs.apply(this, args);
            }
        }

    }

    if (dfLevel <= _globalTraceLvl || (_.isNumber(firstVal) && !_prodMode)){
        logDetail = new LogDetail(message, dfLevel, getTime(), this.fileName);
        console.log(logDetail.makeString(_shortTrace));
    }

    _singleCheck = _singleCheck || [];
    _singleCheck.push(logDetail);

    //new LogDetail(message,)
    return logDetail;

}
DevLogger.prototype.setInstLvl = function (value){
    this.debugLvl = value;
}

DevLogger.setProdMode = function (value){
    _prodMode = value;
}

DevLogger.setShortTrace = function (value){
    _shortTrace = value;
}

DevLogger.getLogDetails = function (){
    var allLogs = [];
    _.each(loggers, function (item){
        allLogs.concat(item);
    })
    return allLogs;
}

DevLogger.getLogger = function (fileName){
    var newDevLogger = new DevLogger(fileName);
    loggers.push(newDevLogger);

    return function (){
        var args = Array.from(arguments);
        newDevLogger.log.apply(newDevLogger, args);
    }
}

module.exports = DevLogger;
