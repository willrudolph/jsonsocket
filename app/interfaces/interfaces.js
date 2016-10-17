/*jslint node:true */
"use strict";

var _ = require('lodash'),
    _log = require('../utils/logger.js').getNew(__filename);

function interfaceService(interfaceDesc, assignObject) {


}

function initInterfaces(config){
    _log.log("init");
}


function clientInterface(){

}

function encryptInterface(){

}

function inputInterface() {

}

function dataInterface() {

}

function securityInterface() {

}

exports.init = function (){

}
exports.getDataIF = dataInterface();
exports.getClientIF = clientInterface();
exports.getEncryptIF = encryptInterface();
exports.getInputIF = inputInterface();
exports.getSecurityIF = securityInterface();