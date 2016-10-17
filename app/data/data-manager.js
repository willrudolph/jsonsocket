/**
 * Created by wr198j on 6/9/2016.
 */

/*jslint node:true */
"use strict";
var _ = require('lodash'),
    _log = require('../utils/logger.js').getNew(__filename),
    utils = require('./../utils/utils.js'),
    configData = {},
    dataObjs = require("./../utils/data-mirror.js"),
    liveJSON,
    lastUpdate,
    consts = {
        arrOp : "ARO_"
    },
    deltaManager = require("./../utils/delta-manager.js"),
    activeDeltaList = [], // unprocessed delta changes
    completedDeltaList = [], // list of completed deltas for between lastUpdate
    dataMirror = {};



function processDeltaInstruct(deltaInstr) {
    if (!deltaInstr.path) {
        console.log("Path currently required for operations");
        return;
    }

    var action = deltaInstr.action,
        amObject = null,
        subAction,
        nextLevelUp,
        opObject,
        opArray;

    if (action.indexOf(consts.arrOp) === 0) {
        opObject = dataObjs.getByRoute(dataMirror, deltaInstr.mirrorPath);
        if (_.isArray(opObject)) {
            opArray = opObject;
        } else if (_.hasIn(opObject, 'retJSObj')) {
            opArray = opObject.value;
        } else {
            console.log("another edge case");
            return;
        }
        if (!_.isArray(opArray)) {
            console.log("attempting to apply array operations to non-array: " + deltaInstr.path);
            return;
        }
        subAction = String(action).substring(4);
        if (deltaInstr.workObj && _.has(deltaInstr.workObj, "args")) {
            opArray[subAction].apply(opArray, deltaInstr.workObj.args);
        } else {
            opArray[subAction]();
        }

    } else if (action === "add") {
        opObject = dataObjs.getByRoute(dataMirror, deltaInstr.mirrorPath);

        if (opObject.key && opObject.value) {
            opObject = opObject.value;
        }

        if (!_.isObject(deltaInstr.workObj)) {
            amObject = deltaInstr.workObj;
        } else {
            amObject = dataObjs.buildMirror(deltaInstr.workObj);
        }

        if (_.isArray(opObject)) {
            opObject.push(amObject);
        } else if (deltaInstr.actionData && deltaInstr.actionData.newName && opObject._isComp) {
            opObject.addKV(deltaInstr.actionData.newName, amObject);
        } else {
            console.log("WARNING - process Delta on Non-array Non-Comp or missing name");
        }

    } else if (action === "rename") {

        nextLevelUp = deltaInstr.mirrorPath.split(".");
        subAction = Number(nextLevelUp.pop());
        opObject = dataObjs.getByRoute(dataMirror, nextLevelUp.join('.'));
        if (_.isArray(opObject || !deltaInstr.actionData.newName)) {
            console.log("can't rename an array. data path:" + deltaInstr.path +
                " or missing name:" + deltaInstr.actionData.newName);
            return;
        }
        if (opObject._isComp) {
            opObject.renameKeyIdx(subAction, deltaInstr.actionData.newName);
        } else if (_.hasIn(opObject, "retJSObj") && opObject.value._isComp) {
            opObject.value.renameKeyIdx(subAction, deltaInstr.actionData.newName);
        } else {
            console.log("or attempting to do something to an array - or something funky");
        }


    } else if (action === "del") {
        console.log("");

    } else if (action === "mod") {
        console.log();
    }
}



function getLiveCopy(path) {
    return dataObjs.cloneByPath(dataMirror, path);
}

function renameNode(path, newName) {
    var newDelta = deltaManager.deltaInstruct("rename", path, null, {"newName" : newName});
    newDelta.mirrorPath = dataObjs.getMirrorRoute(dataMirror, path);
    activeDeltaList.push(newDelta);
    // temp
    // execute
    processDeltaInstruct(newDelta);
}


function removeNode(path) {
    // removes object key ; splices array
    var newDelta = deltaManager.deltaInstruct("del", path);
    newDelta.mirrorPath = dataObjs.getMirrorRoute(dataMirror, path);
    activeDeltaList.push(newDelta);


}


function addNode(path, inDataObj, name) {
    var newDelta = deltaManager.deltaInstruct("add", path, inDataObj, {'newName': name});
    newDelta.mirrorPath = dataObjs.getMirrorRoute(dataMirror, path);
    activeDeltaList.push(newDelta);

    // temp
    // execute
    processDeltaInstruct(newDelta);
}
function modifyNode(path, inDataObj) {
    var newDelta = deltaManager.deltaInstruct("mod", path, inDataObj);
    newDelta.mirrorPath = dataObjs.getMirrorRoute(dataMirror, path);
    activeDeltaList.push(newDelta);
}






/*
*   requires path - top level arrayOps should be avoided.
*   required type
*   Note: arrayOp assumes operation arguments in direct expected order after type
*   Note: Currently does not return anything - only performs operation on array - and only operations that
*   modify existing array; operations that do not modify the existing array will not do anything
*
*
* */
function arrayOp(path, type) {
    var passArgs = Array.from(arguments),
        newDelta;

    if (_.hasIn([], type) && _.isFunction([][type])) {
        if (passArgs.length > 2) {
            passArgs = passArgs.slice(2);
            newDelta = deltaManager.deltaInstruct(consts.arrOp + type, path, {args: passArgs});
        } else {
            newDelta = deltaManager.deltaInstruct(consts.arrOp + type, path);
        }

        newDelta.mirrorPath = dataObjs.getMirrorRoute(dataMirror, path);
        activeDeltaList.push(newDelta);

    } else {
        console.log("not legal array op:" + type);
        // not legal array operation
    }
    // temp
    // execute
    processDeltaInstruct(newDelta);
}





function initDataStore(inJSON, inConfigData) {
    // check for initial Cloning issues, which would indicate issues with the JSON
    utils.stopwatch(true);
    configData = inConfigData;
    dataMirror = dataObjs.buildMirror(inJSON);
    liveJSON = dataObjs.cloneMirror(dataMirror);
    lastUpdate = utils.time();
/*
    // run get test 10000
    utils.stopwatch(true);
    var len = 100000,
        val,
        i = 0;
    for (; i < len; i += 1){
        val = getLiveCopy("[0].glossary.GlossDiv.GlossList.GlossEntry.GlossDef");
    }

    console.log("get live Copy time:" + utils.stopwatch());


    utils.stopwatch(true);
    i = 0;
    for (; i < len; i += 1){
        val = _.get(liveJSON,"[0].glossary.GlossDiv.GlossList.GlossEntry.GlossDef");
    }

    console.log("straight get:" + utils.stopwatch());
*/

 /*   utils.stopwatch(true);
    getByRoute(dataMirror, mirrorPath);
    i = 0;
    for (; i < len; i += 1){
        val = getOpData("[0].glossary.GlossDiv.GlossList.GlossEntry.GlossDef");
    }

    console.log("mirror get:" + utils.stopwatch()); */

/*    utils.stopwatch(true);
    var mPath =  dataObjs.getMirrorRoute(dataMirror, "[0].glossary.GlossDiv.GlossList.GlossEntry.GlossDef");
    i = 0;
    for (; i < len; i += 1){
        val = dataObjs.getByRoute(dataMirror, mPath);
    }

    console.log("get by mirror path:" + utils.stopwatch());

    utils.stopwatch(true);
    i = 0;
    for (; i < len; i += 1){
        val = dataMirror.getByRoute(mPath);
    }

    console.log("get by mirror path proto:" + utils.stopwatch());  */

}

function getOpData(path) {
   // console.log("confirmdata:" + dataMirror + " " + _.isArray(dataMirror));
    var mirrorPath = dataObjs.getMirrorRoute(dataMirror, path),
        dataObj = dataObjs.getByRoute(dataMirror, mirrorPath);

    return (_.hasIn(dataObj, 'retJSObj') ? dataObj.retJSObj() : dataObj);
}


function start(onDeltaFnc, onUpdateCycleFnc){

}


function onDeltaUpdate(callbackFnc) {

}





module.exports.init = initDataStore;
module.exports.read = {
    lastJSON : function () {
        return liveJSON;
    },
    lastNode : function (path) {
        return _.get(liveJSON, path);
    },
    liveJSON : function () {
        return dataObjs.cloneMirror(dataMirror);
    },
    getLiveCopy : getLiveCopy,
    getOpData : getOpData
};
module.exports.write = {
    renameNode : renameNode,
    delNode : removeNode,
    addNode: addNode,
    modifyNode : modifyNode,
    arrayOp : arrayOp
};
module.exports.start = start;

