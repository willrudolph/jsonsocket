/**
 * Created by wr198j on 6/16/2016.
 */

/*jslint node:true */
"use strict";
var _ = require('lodash'),
    _log = require('../utils/logger.js').getLogger(__filename);

function DeltaInstruct(action, path, workObject, actionData) {
    this._completed = false;
    this.action = action;
    this.path = path;
    this.mirrorPath = null;
    this.workObj = workObject;
    this.actionData = actionData;
}


module.exports = {
    deltaInstruct: function (action, path, workObject, actionObj) {
        return new DeltaInstruct(action, path, workObject, actionObj);
    }
}