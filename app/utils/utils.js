/*jslint node:true */
"use strict";

var json = {},
    parse = {},
    os = require('os'),
    timeInfo = {
        startTime : os.uptime(),
        lastSW : null
    },
    path = require('path'),
    fs = require('fs'),
    _ = require('lodash');


json.loadFile = function (fileNameWithPath, onCompleteFnc) {
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


json.getSize = function (object) {

    function objectSize(topObject) {
        var rtnVal = 0;

        switch (typeof topObject) {
        case "boolean":
            rtnVal += 4;
            break;
        case "number":
            rtnVal += 8;
            break;
        case "string":
            rtnVal += (2 * topObject.length);
            break;
        case "object":
            if (!_.isArray(topObject)) {
                _.each(topObject, function (value, key) {
                    rtnVal += 2 * key.length;
                    rtnVal += objectSize(value);
                });
            } else {
                _.each(topObject, function (arrayValue) {
                    rtnVal += objectSize(arrayValue);
                });
            }
            break;
        default:
            console.log("getSize error typeof:" + typeof topObject + " unknown.");
        }
        return rtnVal;
    }

    return objectSize(object);
};

json.getUTF8Size = function( str ) {

    var sizeInBytes = str.split('')
        .map(function( ch ) {
            return ch.charCodeAt(0);
        }).map(function( uchar ) {
// The reason for this is explained later in
// the section “An Aside on Text Encodings”

            return uchar < 128 ? 1 : 2;

        }).reduce(function( curr, next ) {
            return curr + next;
        });

    return sizeInBytes;
};

json.testSize = function () {
    var obj = {"KEY": "VAL"},
        testObj = {
            "a": obj,
            "b": obj,
            "c": obj,
            "d": obj,
            "e": obj,
            "f": obj,
            "g": obj
        }

    console.log(json.getSize("ABCDEFGHIJK") + ":" + json.getUTF8Size("ABCDEFGHIJK"));




    console.log("assert array of n:" + json.getSize(testObj));
    console.log("assert array of n:" + json.getSize([obj,obj,obj,obj,obj,obj,obj]));
    console.log("assert array of n:" + json.getSize(["1","2","3","4","5","6","7","8","9","0"]));
    console.log("assert array of n:" + json.getSize([1,2,3,4,5,6,7,8,9,1]));
    console.log("assert array of n:" + json.getSize([1.1,2.2,3.3,4.4,5.5,6.6,7.7,8.8,9.9,1.0]));
    console.log("assert array of n:" + json.getSize([1.123423241,2.2345234523452345,3.323453253452,4.42352345325,5.52353245345,6.623452345324,7.72345543245,8.8234532443,92345423.9234345,1.0234545325]));
    return json.getSize(obj);
}


parse.optionsParse = function (object){
    var rtnOptions = {};
    _.each(object, function (item){
        var eqIdx;
        if (item.indexOf("--") === 0) {
            eqIdx = item.indexOf("=");
            if (eqIdx != -1){
                rtnOptions[item.substr(2, eqIdx-2)] = item.substr(eqIdx +1);
            }
        }
    })
    return rtnOptions;
}

function triLevelReplace(overWrite, original){
    var subLevelA,
        subLevelB;

    _.each(overWrite, function (subValue, subKey) {
        if (_.has(original, subKey)) {
            subLevelA = original[subKey]
            if (_.isObject(subValue)) {
                _.each(subValue, function (minVal, minKey) {
                    if (_.has(subLevelA, minKey)) {
                        if (_.isObject(minVal)){
                            subLevelB = subLevelA[minKey];
                            _.each(minVal, function (triVal, triKey){
                                if (_.has(subLevelB, triKey)){
                                    subLevelB[triKey] = triVal;
                                }
                            });
                        } else {
                            subLevelA[minKey] = minVal;
                        }
                    }
                });
            }
        }
    });

    return original;
}


var stopWatchTime;


module.exports = {
    json: json,
    time: function (){
        // In ms
        return Math.round((os.uptime() - timeInfo.startTime)*1000);
    },
    stopwatch: function (reset){

        if (reset){
            stopWatchTime = os.uptime() - timeInfo.startTime;
        }
        // ms since last stopwatch call
        stopWatchTime = (os.uptime() - timeInfo.startTime - stopWatchTime);
        return Math.round(stopWatchTime*1000);
    },
    parse : parse,
    subObjectReplace : triLevelReplace

}
