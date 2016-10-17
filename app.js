/*jslint node:true */
"use strict";

var _log = require('./app/utils/logger.js').getLogger(__filename),
    fs = require('fs'),
    path = require('path'),
    lib = require('./lib/lib.js'),
    options = require("./app/utils/options.js"),
    clientSys = require("./app/comms/client.js"),
    utils = require("./app/utils/utils.js"),
    interfaces = require('./app/interfaces/interfaces.js'),
    _ = require('lodash'),
    dataMan = require('./app/data/data-manager.js'),
    httpServer,
    loadedJsonData,
    parsedOptions = lib.optionsParse(process.argv.slice(2)),
    defaultHttpPort = 4000,
    loadedConfigData = null,
    jsonSocketServer = require("./app/index.js");

function baseServerHandler(req, res) {

    switch (req.url) {
    case '/rest/traffic':
        break;
    case '/rest/clients':
        break;
    case '/rest/currentdata':
    case '/rest/curdata':
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(jsonSocketServer.currentJSON()));
        break;
    default:
        if (req.url === "/" || req.url === "/index.html") {
            req.url = "/site/index.html";
        } else {
            req.url = "/site" + req.url;
        }

        // auto strip all params as they aren't needed here
        if (String(req.url).indexOf("?") > -1) {
            _log("Stripping: {0}", req.url);
            var lastSlash = String(req.url).lastIndexOf("/"),
                nextIndex = String(req.url).indexOf("?", lastSlash);

            req.url = String(req.url).substring(0, nextIndex);
        }

        fs.readFile(__dirname + req.url,
            function (err, data) {
                if (err) {
                    res.writeHead(500);
                    return res.end('Error loading: ' + req.url);
                }
                _log("Http send: {0}", req.url);
                res.writeHead(200);
                res.end(data);
            });
    }
}


function initServer() {
    httpServer = require('http').createServer(baseServerHandler);

    httpServer.listen(defaultHttpPort, function () {
        _log("http server listening to: " + defaultHttpPort);
    });
}


function loadFiles(pOptions, onComplete) {
    var sourceOverride;

    function addDirectoryPath(filePath) {
        var rtnName;
        if (filePath.indexOf(__dirname) === 0) {
            rtnName = filePath;
        } else {
            rtnName = path.join(__dirname, filePath);
        }
        return rtnName;
    }

    function loadSourceJson(data) {
        loadedJsonData = data;
        onComplete();
    }

    function setConfigData(data) {
        loadedConfigData = data;

        if (loadedConfigData.base.source) {
            var actSource = sourceOverride || loadedConfigData.base.source;
            lib.loadJson(addDirectoryPath(actSource), loadSourceJson);
        } else {
            onComplete();
        }
    }

    if (_.has(pOptions, "config") && _.has(pOptions, "source")) {
        sourceOverride = pOptions.source;
        lib.loadJson(addDirectoryPath(pOptions.config), setConfigData);
    } else if (_.has(pOptions, "config")) {
        // loads config file
        // currently just replaces existing config file
        lib.loadJson(addDirectoryPath(pOptions.config), setConfigData);
    } else if (_.has(pOptions, "source")) {
        lib.loadJson(addDirectoryPath(pOptions.source), loadSourceJson);
    } else {
        onComplete();
    }
}

function onExtFilesLoaded() {
    jsonSocketServer.start(loadedJsonData);
    initServer();
}

_log('app start');
loadFiles(parsedOptions, onExtFilesLoaded);

