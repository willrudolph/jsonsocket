
/*jslint node:true */
"use strict";
var _ = require('lodash'),
    _log = require('../utils/logger.js').getLogger(__filename);


/*
normal object path:[1].menu.popup.menuitem[0].value
mirror object path:1.0.2.0.0.0
 */
function getMirrorRoute(objComposite, path) {
    var rtnMPath = [];

    function findMirrorRecursor(objComposite, currentPath) {
        if (!_.isString(currentPath)) {
            console.log();
        }
        var pattern = /\[([0-9])\]/g,
            tempVal,
            arrIdx,
            keyIdx,
            subLevelObj,
            tempWorkObj,
            arrPath = currentPath.split('.'),
            curPath = arrPath[0],
            arrTags = curPath.match(pattern);
        if (arrTags) {
            if (arrTags.length > 1) {
                curPath = arrTags.shift();
            } else if (arrTags.length === 1 || (arrTags[0] === curPath || curPath.indexOf('[') > 0)){
                arrTags.shift();
            } else {
                console.log("yet another edge case");
            }
        }

        if (curPath[0] === "[") {
            if (_.isArray(objComposite)) {
                keyIdx = String(curPath).substring(1, curPath.indexOf(']'));
                subLevelObj = objComposite[keyIdx];
                rtnMPath.push(keyIdx);
                arrPath.shift();
            } else {
                console.log("path location " + curPath + " as main object is not an array.[full path] " + currentPath + " ob" + objComposite);
                return;
            }
        } else {
            arrIdx = curPath.indexOf('[');
            if (arrIdx === -1) {
                if (_.isObject(objComposite) && _.has(objComposite, "_isComp")) {
                    keyIdx = objComposite.findKey(curPath);
                    if (_.isUndefined(keyIdx)) {
                        console.log("Key: " + tempVal + " does not exist.");
                        return;
                    }
                    subLevelObj = objComposite.getKey(curPath);
                    rtnMPath.push(keyIdx);
                    arrPath.shift();
                } else {
                    console.log("new condition");
                }
            } else {
                tempVal = String(curPath).substring(0, arrIdx);
                keyIdx = String(curPath).substring(arrIdx + 1, String(curPath).length - 1);
                tempVal = objComposite.findKey(tempVal);
                if (_.isUndefined(tempVal)) {
                    console.log("Key: " + tempVal + " does not exist.");
                    return;
                }
                tempWorkObj = objComposite.getKey(tempVal);
                rtnMPath.push(tempVal);
                rtnMPath.push(keyIdx);
                if (!_.isArray(tempWorkObj.value)) {
                    console.log("Key: " + tempVal + " is not an array");
                    return;
                }
                subLevelObj = tempWorkObj.value[keyIdx];
                arrPath.shift();
            }
        }
        if (arrTags) {
            while (arrTags.length > 0) {
                arrPath.unshift(arrTags.pop());
            }
        }


        if (arrPath.length !== 0) {
            if (subLevelObj.key === curPath) {
                findMirrorRecursor(subLevelObj.value, arrPath.join('.'));
            } else {
                findMirrorRecursor(subLevelObj, arrPath.join('.'));
            }
        }
    }

    findMirrorRecursor(objComposite, path);

    return rtnMPath.join('.');
}
/// NOT COMPLETED
function routeToPath(objComposite, mirrorRoute){
    var rtnNPath = [];

    function findPathRecursor(objComposite, mirrorRoute) {
        if (!_.isString(mirrorRoute)) {
            console.log();
        }
        var pattern = /\[([0-9])\]/g,
            tempVal,
            arrIdx,
            keyIdx,
            subLevelObj,
            tempWorkObj,
            arrPath = mirrorRoute.split('.'),
            curPath = arrPath[0],
            arrTags = curPath.match(pattern);
        if (arrTags) {
            if (arrTags.length > 1) {
                curPath = arrTags.shift();
            } else if (arrTags.length === 1 || (arrTags[0] === curPath || curPath.indexOf('[') > 0)){
                arrTags.shift();
            } else {
                console.log("yet another edge case");
            }
        }

        if (curPath[0] === "[") {
            if (_.isArray(objComposite)) {
                keyIdx = String(curPath).substring(1, curPath.indexOf(']'));
                subLevelObj = objComposite[keyIdx];
                rtnMPath.push(keyIdx);
                arrPath.shift();
            } else {
                console.log("path location " + curPath + " as main object is not an array.[full path] " + mirrorRoute + " ob" + objComposite);
                return;
            }
        } else {
            arrIdx = curPath.indexOf('[');
            if (arrIdx === -1) {
                if (_.isObject(objComposite) && _.has(objComposite, "_isComp")) {
                    keyIdx = objComposite.findKey(curPath);
                    if (_.isUndefined(keyIdx)) {
                        console.log("Key: " + tempVal + " does not exist.");
                        return;
                    }
                    subLevelObj = objComposite.getKey(curPath);
                    rtnMPath.push(keyIdx);
                    arrPath.shift();
                } else {
                    console.log("new condition");
                }
            } else {
                tempVal = String(curPath).substring(0, arrIdx);
                keyIdx = String(curPath).substring(arrIdx + 1, String(curPath).length - 1);
                tempVal = objComposite.findKey(tempVal);
                if (_.isUndefined(tempVal)) {
                    console.log("Key: " + tempVal + " does not exist.");
                    return;
                }
                tempWorkObj = objComposite.getKey(tempVal);
                rtnMPath.push(tempVal);
                rtnMPath.push(keyIdx);
                if (!_.isArray(tempWorkObj.value)) {
                    console.log("Key: " + tempVal + " is not an array");
                    return;
                }
                subLevelObj = tempWorkObj.value[keyIdx];
                arrPath.shift();
            }
        }
        if (arrTags) {
            while (arrTags.length > 0) {
                arrPath.unshift(arrTags.pop());
            }
        }


        if (arrPath.length !== 0) {
            if (subLevelObj.key === curPath) {
                findPathRecursor(subLevelObj.value, arrPath.join('.'));
            } else {
                findPathRecursor(subLevelObj, arrPath.join('.'));
            }
        }
    }

    findPathRecursor(objComposite, path);

    return rtnMPath.join('.');
}


// Returns KeyValue and objComposite Objects
// Non-destructive/no new creation
function getByRoute(objComposite, mirrorPath) {

    function mirrorRecursiveGet(objComposite, mirrorPath) {
        var mirrorArray = mirrorPath.split("."),
            curPoint = Number(mirrorArray[0]),
            subObject,
            rtnObj;

        if (_.isArray(objComposite)) {
            subObject = objComposite[curPoint];
            mirrorArray.shift();
        } else if (_.isObject(objComposite) && _.has(objComposite, "_isComp")) {
            subObject = objComposite.getKey(curPoint);
            mirrorArray.shift();
        } else {
            console.log("mirror new condition");
        }

        if (mirrorArray.length !== 0) {
            if (_.has(subObject, "_isComp") || _.isArray(subObject)) {
                rtnObj = mirrorRecursiveGet(subObject, mirrorArray.join('.'));
            } else {
                rtnObj = mirrorRecursiveGet(subObject.value, mirrorArray.join('.'));
            }
        } else {
            rtnObj = subObject;
        }

        return rtnObj;
    }

    return mirrorRecursiveGet(objComposite, mirrorPath);
}


function KeyValObj(key, value) {
    this.key = key;
    this.value = value;
}

KeyValObj.prototype.retJSObj = function () {
    return (this.value._isComp) ? this.value.retJSObj() : this.value;
};

function ObjComposite(object) {
    var arrayRef = [],
        tempArray;
    _.each(object, function (value, key) {
        if (_.isObject(value) && !_.isArray(value)) {
            arrayRef.push(new KeyValObj(key, new ObjComposite(value)));
        } else if (_.isArray(value)) {
            tempArray = [];
            _.each(value, function (item) {
                if (_.isObject(item) && !_.isArray(item)) {
                    tempArray.push(new ObjComposite(item));
                } else {
                    tempArray.push(item);
                }
            });
            arrayRef.push(new KeyValObj(key, tempArray));
        } else {
            arrayRef.push(new KeyValObj(key, value));
        }
    });

    this.kvArray = arrayRef;
    this._length = this.kvArray.length;
    this._isComp = true;
}

ObjComposite.prototype.length = function () {
    return this._length;
}

ObjComposite.prototype.addKV = function (key, value) {
    var existingKey = _.find(this.kvArray, {key : key});
    if (!existingKey){
        this.kvArray.push(new KeyValObj(key,value));
        this._length = this.kvArray.length;
    } else {
        existingKey.value = value;
    }
}

ObjComposite.prototype.deleteKV = function (key){
    var len,
        i,
        idx,
        checkVal;

    if (_.isString(key)) {
        len = this._length;
        i = 0;
        for (;i < len; i += 1) {
            checkVal = this.kvArray[i];
            if (checkVal.key === key) {
                idx = checkVal.value;
                break;
            }
        }
        this.kvArray.slice(idx,1);
    } else if (_.isInteger(key)) {
        if (key > 0 && key < this._length){
            this.kvArray.slice(key,1);
        }
    }
    this._length = this.kvArray.length;
}

ObjComposite.prototype.findKey = function (name){
    var rtnVal = undefined,
        len,
        i,
        checkVal;
    len = this._length;
    i = 0;
    for (;i < len; i += 1) {
        checkVal = this.kvArray[i];
        if (checkVal.key === name) {
            rtnVal = i;
            break;
        }
    }
    if (_.isUndefined(rtnVal)){
        console.log('key does not exist');
    }
    return rtnVal;
}

ObjComposite.prototype.getKey = function (key){
    var rtnVal = undefined,
        len,
        i,
        checkVal;

    if (_.isString(key)) {
        i = this.findKey(key);
        rtnVal = this.kvArray[i];


    } else if (_.isInteger(key)) {
        rtnVal = this.kvArray[key];
    }
    return rtnVal;
}

ObjComposite.prototype.renameKeyIdx = function (keyIdx, name){
    this.kvArray[keyIdx].key = name;
}


ObjComposite.prototype.retJSObj = function (){
    var rtnStdJSObj = {},
        len = this._length,
        i = 0,
        value;

    for(;i < len; i += 1){
        value = this.kvArray[i].value;
        if (!value){
            rtnStdJSObj[this.kvArray[i].key] = value;
        } else if (_.isArray(value)) {
            var addArray = [];
            _.each(value, function (item) {
                addArray.push((item && item._isComp) ? item.retJSObj() : item);
            })
            rtnStdJSObj[this.kvArray[i].key] = addArray;
        } else {
            rtnStdJSObj[this.kvArray[i].key] = (value && value._isComp) ? value.retJSObj() : value;
        }
    }
    return rtnStdJSObj;
}

ObjComposite.prototype.getByRoute = function (mirrorPath) {

    function mirrorRecursiveGet(objComposite, mirrorPath) {
        var mirrorArray = mirrorPath.split("."),
            curPoint = Number(mirrorArray[0]),
            subObject,
            rtnObj;

        if (_.isArray(objComposite)) {
            subObject = objComposite[curPoint];
            mirrorArray.shift();
        } else if (_.isObject(objComposite) && _.has(objComposite, "_isComp")) {
            subObject = objComposite.getKey(curPoint);
            mirrorArray.shift();
        } else {
            console.log("mirror new condition");
        }

        if (mirrorArray.length !== 0) {
            if (_.has(subObject, "_isComp") || _.isArray(subObject)) {
                rtnObj = mirrorRecursiveGet(subObject, mirrorArray.join('.'));
            } else {
                rtnObj = mirrorRecursiveGet(subObject.value, mirrorArray.join('.'));
            }
        } else {
            rtnObj = subObject;
        }

        return rtnObj;
    }

    return mirrorRecursiveGet(this, mirrorPath);
}



function cloneByPath(objComposite, path) {
    var rtnObj = null,
        pattern = /\[([0-9])\]/g,
        tempVal,
        arrIdx,
        tempObj,
        tempArray,
        arrPath = path.split('.'),
        curPath = arrPath[0],
        arrTags = curPath.match(pattern);

    if (arrTags) {
        if (arrTags.length > 1) {
            curPath = arrTags.shift();
        } else if (arrTags.length === 1 || (arrTags[0] === curPath || curPath.indexOf('[') > 0)){
            arrTags.shift();
        } else {
            console.log("yet another edge case");
        }
    }

    if (curPath[0] === "[") {
        if (_.isArray(objComposite)) {
            tempVal = String(arrPath[0]).substring(1, arrPath[0].indexOf(']'));
            tempObj = objComposite[tempVal];
            arrPath.shift();
        }
    } else {
        arrIdx = curPath.indexOf('[');
        if (arrIdx === -1){
            if (_.isObject(objComposite) && _.has(objComposite, "_isComp")) {
                tempObj = objComposite.getKey(curPath);
                arrPath.shift();
            } else {
                console.log("new condition")
            }
        } else {
            tempVal = String(curPath).substring(0, arrIdx);
            arrIdx = String(curPath).substring(arrIdx + 1 , String(curPath).length -1);
            tempObj = objComposite.getKey(tempVal).value[arrIdx];
            arrPath.shift();
        }
    }
    if (arrTags){
        while (arrTags.length > 0){
            arrPath.unshift(arrTags.pop());
        }
    }


    if (arrPath.length === 0){
        tempArray = [];
        if (_.isArray(tempObj)){
            _.each(tempObj, function (item){
                tempArray.push((_.has(item, '_isComp') && item._isComp) ? item.retJSObj() : item);
            })
            rtnObj = tempArray;
        } else if (_.has(tempObj, '_isComp') && tempObj._isComp) {
            rtnObj = tempObj.retJSObj();
        } else if (_.has(tempObj, "key") && tempObj.key === path){
            rtnObj = (_.has(tempObj.value, '_isComp') && tempObj.value._isComp) ? tempObj.value.retJSObj() :
                tempObj.value;
            if (_.isArray(rtnObj)){
                _.each(rtnObj, function (item){
                    tempArray.push((_.has(item, '_isComp') && item._isComp) ? item.retJSObj() : item);
                });
                rtnObj = tempArray;
            }
        } else {
            rtnObj = tempObj;
        }
    } else {
        if (tempObj && !tempObj._isComp && !_.isArray(tempObj)) {
            if (tempObj.key === curPath) { // KVObject
                rtnObj = cloneByPath(tempObj.value, arrPath.join("."));
            } else {
                console.log("new edge case");
            }
        } else {
            rtnObj = cloneByPath(tempObj, arrPath.join('.'));
        }

    }

    return rtnObj;
}

function buildMirror(inJsonObj) {
    var rtnDataMirror = {};
    _log("begin building mirror");
    function arrayRecursor(inJsonObj) {
        var rtnDataArray = [];

        _.each(inJsonObj, function (value) {
            if (_.isObject(value) && !_.isArray(value)) {
                rtnDataArray.push(new ObjComposite(value));
            } else if (_.isArray(value)) {
                rtnDataArray.push(arrayRecursor(value));
            } else {
                rtnDataArray.push(value);
            }
        });
        return rtnDataArray;
    }

    if (_.isObject(inJsonObj) && !_.isArray(inJsonObj)) {
        rtnDataMirror = new ObjComposite(inJsonObj);
    } else if (_.isArray(inJsonObj)) {
        rtnDataMirror = arrayRecursor(inJsonObj);
    }
    _log('end mirror build');
    return rtnDataMirror;
}

function cloneMirror(dataMirror) {
    var rtnJson;

    function arrayRecursor(inArrayObj) {
        var rtnDataArray = [];

        _.each(inArrayObj, function (value) {
            if (value && value._isComp) {
                rtnDataArray.push(value.retJSObj());
            } else if (_.isArray(value)) {
                rtnDataArray.push(arrayRecursor(value));
            } else {
                rtnDataArray.push(value);
            }
        });
        return rtnDataArray;
    }

    if (_.isArray(dataMirror)) {
        rtnJson = arrayRecursor(dataMirror);
    } else {
        rtnJson = dataMirror.retJSObj();
    }

    return rtnJson;
}

module.exports = {
    keyVal: function (key, value) {
        return new KeyValObj(key, value);
    },
    objComp: function (object) {
        return new ObjComposite(object);
    },
    cloneByPath: cloneByPath,
    getMirrorRoute: getMirrorRoute,
    getByRoute : getByRoute,
    routeToPath: routeToPath,
    buildMirror : buildMirror,
    cloneMirror : cloneMirror
}