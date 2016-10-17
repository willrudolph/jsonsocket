/*jslint node:true */
"use strict";

function defaultConfig() {
    this.comms = {
        readSocket: 7000,
        writeSocket: 7000
    }

    this.logs = {
        loglevel : 5
    }
    this.base = {
        subbase: "156",
        other: {
            subvalue: "N/A"
        }
    }
    this.data_manager = {
        opsPerTick : 10,
        updateLiveJson : 100,
        processTick : 5
    };
}








/*






var state = [{








    id: 0,


    transform: {


        position: {


            x: 15.290663048624992,


            y: 2.0000000004989023,


            z: -24.90756910131313


        },


        rotation: {


            x: 0.32514392007855847,


            y: -0.8798439564294107,


            z: 0.32514392007855847,


            w: 0.12015604357058937


        }


    }


}, {


    id: 1,


    transform: {


        position: {


            x: 7.490254936274141,


            y: 2.0000000004989023,


            z: -14.188117316225544


        },


        rotation: {


            x: 0,


            y: 0.018308020720336753,


            z: 0.1830802072033675,


            w: 0.9829274917854702


        }


    }

}];
var msg = JSON.stringify( state );
var getUTF8Size = function( str ) {

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

var msgSize = getUTF8Size( msg ); // 410 bytes

var slimState = [[
    0,
    15.290663048624992,
    2.0000000004989023,
    -24.90756910131313,
    0.32514392007855847,
    -0.8798439564294107,
    0.32514392007855847,
    0.12015604357058937
], [
    1,
    7.490254936274141,
    2.0000000004989023,
    -14.188117316225544,
    0,
    0.018308020720336753,
    0.1830802072033675,
    0.9829274917854702
]];


var slimMsg = JSON.stringify( slimState );
var char = new Int8Array( 1 );

// uchar now shares the same ArrayBuffer as char.

var uchar = new Uint8Array( char.buffer );
char.buffer === uchar.buffer; // true

char[0] = -1;
uchar[0] === 255; // true, same data interpreted differently
var arr = new Float64Array([15.290663048624992]);


// { '0': 15.290663048624992,
// buffer:
// { '0': 0,
// '1': 0,
// '2': 128,
// '3': 201,
// '4': 209,
// '5': 148,
// '6': 46,
// '7': 64,
// byteLength: 8 },
// BYTES_PER_ELEMENT: 8,
// length: 1,
// set: [Function: set],
// slice: [Function: slice],
// byteOffset: 0,
// byteLength: 8,
// subarray: [Function: subarray] }
// Compact the state.

var slimmerState = new Float64Array([
    0,
    15.290663048624992,
    2.0000000004989023,
    -24.90756910131313,
    0.32514392007855847,
    -0.8798439564294107,
    0.32514392007855847,
    0.12015604357058937,
    1,
    7.490254936274141,
    2.0000000004989023,
    -14.188117316225544,
    0,
    0.018308020720336753,
    0.1830802072033675,
    0.9829274917854702

]);

// Impose an 8-bit unsigned format onto the bytes
// stored in the ArrayBuffer.
var ucharView = new Uint8Array( slimmerState.buffer );
var slimmerMsg = String.fromCharCode.apply(
    String, [].slice.call( ucharView, 0 )
);
var slimmerMsgSize = getUTF8Size( slimmerMsg ); // 170 bytes
// Decode

var decodeBuffer = new ArrayBuffer( slimmerMsg.length );
var decodeView = new Uint8Array( decodeBuffer );

// Put message back into buffer as 8-bit unsigned.

for ( var i = 0; i < slimmerMsg.length; ++i ) {
    decodeView[i] = slimmerMsg.charCodeAt( i );
}


// Interpret the data as JavaScript Numbers
var decodedState = new Float64Array( decodeBuffer );
var encodeUint8 = (function() {

    var arr = new Uint8Array( 1 );
    return function( number ) {
// If we assume that the number passed in
// valid, we can just use it directly.
// return String.fromCharCode( number );
        arr[0] = number;
        return String.fromCharCode( arr[0] );
    };
}());

var encodeFloat32 = (function() {

    var arr = new Float32Array( 1 );
    var char = new Uint8Array( arr.buffer );
    return function( number ) {
        arr[0] = number;
// In poduction code, please pay

// attention to endianness here.
        return String.fromCharCode( char[0], char[1], char[2], char[3] );
    };
}());


var encodeState = function( state ) {

    var msg = '';
    for ( var i = 0; i < state.length; ++i ) {
        var player = state[i];

// Encode id

        msg += encodeUint8( player.id );
// Encode transform
        msg += ( encodeFloat32( player.transform.position.x ) +

        encodeFloat32( player.transform.position.y ) +
        encodeFloat32( player.transform.position.z ) +
        encodeFloat32( player.transform.rotation.x ) +
        encodeFloat32( player.transform.rotation.y ) +
        encodeFloat32( player.transform.rotation.z ) +
        encodeFloat32( player.transform.rotation.w ) );
    }
    return msg;
};

var impreciseMsg = encodeState( state );
// Decode

var decodeUint8 = function( str, offset, obj, propName ) {
    obj[ propName ] = str.charCodeAt( offset );
// Number of bytes (characters) read.
    return 1;
};

var decodeFloat32 = (function() {

    var arr = new Float32Array( 1 );
    var char = new Uint8Array( arr.buffer );
    return function( str, offset, obj, propName ) {

// Again, pay attention to endianness
// here in production code
        for ( var i = 0; i < 4; ++i ) {
            char[i] = str.charCodeAt( offset + i );
        }
        obj[ propName ] = arr[0];

// Number of bytes (characters) read

        return 4;
    };

}());

var decodeState = function( str ) {
    var charsRead = 0;
    var state = [];

    while ( charsRead < str.length ) {
// GC performance suffers here. Read Martin Wells’
// article about writing GC-friendly code, here

// on BuildNewGames.com
        var player = { transform: {} };
        var position = player.transform.position = {};
        var rotation = player.transform.rotation = {};

// !!!: The order of decode is same as encode!

// Decode id
        charsRead += decodeUint8( str, charsRead, player, 'id' );

// Decode transform
        charsRead += decodeFloat32( str, charsRead, position, 'x' );
        charsRead += decodeFloat32( str, charsRead, position, 'y' );
        charsRead += decodeFloat32( str, charsRead, position, 'z' );
        charsRead += decodeFloat32( str, charsRead, rotation, 'x' );
        charsRead += decodeFloat32( str, charsRead, rotation, 'y' );
        charsRead += decodeFloat32( str, charsRead, rotation, 'z' );
        charsRead += decodeFloat32( str, charsRead, rotation, 'w' );
        state.push( player );
    }
    return state;
};



var decodedState = decodeState( impreciseMsg );
// Shared code

var MsgType = {

    "game start": String.fromCharCode(0),
    "update state": String.fromCharCode(1),
    "private message": String.fromCharCode(2)

};

var MsgTypeLookup = [

    "game start",
    "update state",
    "private message"
];





var createNetEmitter = function( EventEmitter2, socket ) {
    var receive = new EventEmitter2({ wildcard: true });
    socket.on( 'message', function( encodedString ) {
        var event = MsgTypeLookup[ encodedString.charCodeAt(0) ];
        netreceive.emit( event, encodedString.substr(1) );
    });

    var send = new EventEmitter2({ wildcard: true });
    netsend.on( '*', function( event, encodedString ) {
        socket.emit( 'message', MsgType[this.event] + encodedString );
    });
    return { receive: receive, send: send };
};








// Server code


var EventEmitter2 = require('eventemitter2').EventEmitter2;

io.sockets.on( 'connection', function( socket ) {

    var net = createNetEmitter( EventEmitter2, socket );
    net.send.emit( 'game start', 'world state goes here' );
});


// Client code

// Include the EventEmitter2 library

var socket = io.connect();

socket.on( 'connect', function() {

    var net = createNetEmitter( EventEmitter2, socket );
    net.receive.on( 'game start', function( worldState ) {
        var state = decode( worldState );

    });
});


*/

var _ = require('lodash');

exports.config = new defaultConfig();

