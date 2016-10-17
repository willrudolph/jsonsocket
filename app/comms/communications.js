/**
 * Created by wr198j on 6/16/2016.
 */
/*jslint node:true */
"use strict";

var socketIO = require('socket.io'),

    config,
    readSocket,
    writeSocket;

// APIs for both


function onClientConnect(inSocket) {
    console.log('a user connected');

    var newClient = clientSys.getClient();
    newClient.id = "id" + Math.floor(Math.random() * 100000); // random number for now

    curClients.push(newClient);
    inSocket.on('chat message', function (msg) {
        socketServer.emit('chat message', msg);
    });

    inSocket.on('req_all', function () {
        inSocket.emit('responseAll', dataMan.read.lastJSON());
    })

    inSocket.on('disconnect', function () {
        console.log('user disconnected');
    });

    newClient.socket = inSocket;
}

function initSocket() {
    writeSocket = require('socket.io')(config.base.socketPort);
    writeSocket.on('connection', onClientConnect);
}
exports.init = function (commsConfig) {
    config = commsConfig;
}
exports.communications = {"yes": false};
