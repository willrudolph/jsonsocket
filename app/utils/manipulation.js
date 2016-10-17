/*jslint node:true */
"use strict";


var dataMan = {},
    SJSCONST = "_?",
    ProObjArray = function () {
        this[SJSCONST + "isNative"] = false;
        return [];
    },
    KVo = function (keyName, value) {
        this.key = keyName;
        this.value = value;
    },
    sjsPrivId = "_?",
    _ = require('lodash');

console.log("present?:" + _.dotRef);

ProObjArray.prototype = [];

ProObjArray.prototype.getKey = function (keyName) {
    var kidx = this.idxKey(keyName)
    return (kidx > 0) ? this[kidx].value : undefined;
};

ProObjArray.prototype.setKey = function (keyName, value){
    var kidx = this.idxKey(keyName);

    if (kidx > 0) {
        this[kidx].value = value;
    } else {
        this.push(new KVo(keyName, value));
    }
};

ProObjArray.prototype.delKey = function (keyName) {

};

ProObjArray.prototype.getObj = function () {

};

ProObjArray.prototype.idxKey = function (keyName) {
    return this.indexOf(keyName);
};


function createProArray(jsonObject) {
    var rtnPArray = new ProObjArray();
    _.each(jsonObject, function (key, value) {
        rtnPArray.setKey(key, value);
    });
    return rtnPArray;
}


function processNode(jsonNodeObject) {
    _.each(jsonNodeObject, function (key, value) {
        if (_.isArray(value) {

        } else if (_.isObject(value)) {

        }
    })
}

function createNestedValue(inJSObj) {
    if (_.isArray(inJSObj)) {

    } else if (_.isObject(inJSObj)){

    } else {
        console.log(typeof inJSObj);
    }
}


function createNativeMirror(inJSObjectArray) {
    var rtnSjsJson = new ProObjArray();
    rtnSjsJson[SJSCONST + "isNative"] = true;
    _.each(inJSObjectArray, function (idx, value) {
        rtnSjsJson.push(value);
    })

}


function createKeyValMirror(inJSObject) {
    var rtnSjsJson = new ProObjArray();
    _.each(inJSObject, function (key, value) {
        rtnSjsJson.push(new KVo(keyName, value));
    })
}


dataMan.preProcess = function (inJson) {
    var sjsJson = new ProObjArray();

    if (_.isArray(inJson))  {


    } else {

    }
}








    if (_.isArray(inJson)) {
        sjsJson = [];
        _.each(inJson, function (idx, value){
            if (_.isArray(value)){

            } else if (_.isObject(value)){

            } else {

            }
        )

    } else if (_.isObject(inJson)){
        sjsJson = new ProObjArray();

    }



    return sjsJson;
}


dataMan.determineDeltas = function (alphaJson, betaJson) {

}



// create new key value pair
// remove key value
// by key change value
// copy value
// change value to JSON object (subkeys?)
//









export.dataTrans = dataMan