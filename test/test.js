/**
 * Created by wr198j on 6/14/2016.
 */
/*jslint node:true */
"use strict";

var fs = require('fs'),
    path = require('path'),
    assert = require('chai').assert,
    _ = require('lodash'),
    lib = require("../lib/lib.js"),
    baseJson = {},
    dataMan = require('../app/data/data-manager.js');

describe("Json suite", function (){

    describe('Mirror Tests', function (){

        var readSuite01A = [
            {path: "[0].glossary.title",                                        expected: "example glossary"},
            {path: "[0].glossary.GlossDiv.title",                               expected: "S"},
            {path: "[0].glossary.GlossDiv.GlossList.GlossEntry.ID",             expected: "SGML"},
            {path: "[0].glossary.GlossDiv.GlossList.GlossEntry.Abbrev",         expected: "ISO 8879:1986"},
            {path: "[0].glossary.GlossDiv.GlossList.GlossEntry.GlossSee",       expected: "markup"},
            {path: "[0].glossary.GlossDiv.GlossList.GlossEntry.GlossDef.para",  expected: "A meta-markup language, used to create markup languages such as DocBook."},
            {path: "[0].glossary.GlossDiv.GlossList.GlossEntry.GlossDef.GlossSeeAlso[1]", expected: "XML"},
            {path: "[1].menu.id",                                               expected: "file"},
            {path: "[1].menu.popup.menuitem[0].value",                          expected: "New"},
            {path: "[1].menu.popup.menuitem[1].onclick",                        expected: "OpenDoc()"},
            {path: "[1].menu.popup.menuitem[2].value",                          expected: "Close"},
            {path: "[2].widget.debug",                                          expected: "on"},
            {path: "[2].widget.window.name",                                    expected: "main_window"},
            {path: "[2].widget.window.height",                                  expected: 500},
            {path: "[2].widget.image.src",                                      expected: "Images/Sun.png"},
            {path: "[3].web-app.servlet[0].servlet-name",                       expected: "cofaxCDS"},
            {path: "[3].web-app.servlet[0].init-param.useJSP",                  expected: false},
            {path: "[3].web-app.servlet[0].init-param.redirectionClass",        expected: "org.cofax.SqlRedirection"},
            {path: "[3].web-app.servlet[1].servlet-name",                       expected: "cofaxEmail"},
            {path: "[3].web-app.servlet[1].init-param.mailHost",                expected: "mail1"},
            {path: "[3].web-app.servlet-mapping.cofaxAdmin",                    expected: "/admin/*"},
            {path: "[3].web-app.taglib.taglib-uri",                             expected: "cofax.tld"},
            {path: "[4].menu.header",                                           expected: "SVG Viewer"},
            {path: "[4].menu.items[2]",                                         expected: null},
            {path: "[4].menu.items[3].id",                                      expected: "ZoomIn"},
            {path: "[4].menu.items[5].label",                                   expected: "Original View"},
            {path: "[4].menu.items[11].id",                                     expected: "Find"},
            {path: "[4].menu.items[21].label",                                  expected: "About Adobe CVG Viewer..."},
            {path: "[5][0].balance",                                            expected: "$2,110.25"}
        ],
            readSuite01B = [
                {path: "[0]"},
                {path: "[1]"},
                {path: "[2]"},
                {path: "[3]"},
                {path: "[4]"},
                {path: "[5]"},
                {path: "[0].glossary"},
                {path: "[0].glossary.GlossDiv"},
                {path: "[0].glossary.GlossDiv.GlossList.GlossEntry"},
                {path: "[0].glossary.GlossDiv.GlossList.GlossEntry.GlossDef"},
                {path: "[0].glossary.GlossDiv.GlossList.GlossEntry.GlossDef.GlossSeeAlso"},
                {path: "[1].menu"},
                {path: "[1].menu.popup"},
                {path: "[1].menu.popup.menuitem"},
                {path: "[1].menu.popup.menuitem[2]"},
                {path: "[2].widget"},
                {path: "[2].widget.window"},
                {path: "[2].widget.image"},
                {path: "[3].web-app.servlet"},
                {path: "[3].web-app.servlet[0]"},
                {path: "[3].web-app.servlet[0].init-param"},
                {path: "[3].web-app.servlet[1]"},
                {path: "[3].web-app.servlet[1].init-param"},
                {path: "[3].web-app.servlet-mapping"},
                {path: "[3].web-app.taglib"},
                {path: "[4].menu"},
                {path: "[4].menu.items"},
                {path: "[4].menu.items[3]"},
                {path: "[4].menu.items[5]"},
                {path: "[4].menu.items[11]"},
                {path: "[4].menu.items[21]"}
            ];


        beforeEach(function (done) {
            lib.loadJson(path.join(__dirname, "json/test_suite_json01.json"), function (data) {
                dataMan.init(data);
                done();
            });
        })




        describe('JSON Last Read', function (){
            readSuite01A.forEach(function(test){
                it("Read Last JSON '" + test.path + "'", function () {
                    assert.equal(dataMan.read.getLiveCopy(test.path), test.expected);
                });
            });

        })

        describe('JSON Live Read', function (){

            readSuite01A.forEach(function(test){
                it("Read Live JSON: '" + test.path + "'", function () {
                    assert.equal(dataMan.read.getLiveCopy(test.path), test.expected);
                });
            });
        })


        describe("JSON equal Objects", function () {
            readSuite01B.forEach(function (test) {
                it("Obj = Obj '" + test.path + "'", function () {
                    assert.isOk(_.isEqual(dataMan.read.getLiveCopy(test.path), dataMan.read.lastNode(test.path)));
                });
            });
        })


        describe('JSON equal Values', function () {
            readSuite01A.forEach(function (test) {
                it("Live vs Last '" + test.path + "'", function () {
                    assert.equal(dataMan.read.getLiveCopy(test.path), dataMan.read.lastNode(test.path));
                });
            });
        })


        describe('JSON Write Tests', function () {
            var expectedArray1 = [0,1,2,3,4,5,6,7,8,9]
            describe('Array Op Tests', function () {

                it('pop check', function () {
                    var path = "[5][0].range";
                    dataMan.write.arrayOp(path, "pop");
                    assert.isOk(_.isEqual(dataMan.read.getLiveCopy(path), [0,1,2,3,4,5,6,7,8]));
                })
                it('push check', function () {
                    var path = "[5][0].range";
                    dataMan.write.arrayOp(path, "push", 99);
                    assert.isOk(_.isEqual(dataMan.read.getLiveCopy(path), [0,1,2,3,4,5,6,7,8,9,99]));
                })
                it('shift check', function () {
                    var path = "[5][0].range";
                    dataMan.write.arrayOp(path, "shift");
                    assert.isOk(_.isEqual(dataMan.read.getLiveCopy(path), [1,2,3,4,5,6,7,8,9]));
                })
                it('unshift check', function () {
                    var path = "[5][0].range";
                    dataMan.write.arrayOp(path, "unshift", 99);
                    assert.isOk(_.isEqual(dataMan.read.getLiveCopy(path), [99,0,1,2,3,4,5,6,7,8,9]));
                })
                it('splice check', function () {
                    var path = "[5][0].range";
                    dataMan.write.arrayOp(path, "splice", 2, 3);
                    assert.isOk(_.isEqual(dataMan.read.getLiveCopy(path), [0,1,5,6,7,8,9]));
                })

                it('reverse check', function () {
                    var path = "[5][0].range";
                    dataMan.write.arrayOp(path, "reverse");
                    assert.isOk(_.isEqual(dataMan.read.getLiveCopy(path), [9,8,7,6,5,4,3,2,1,0]));
                })
            })

            describe('renameNode', function () {
                it('rename name', function (){
                    var path = "[1].menu.popup.menuitem";
                    dataMan.write.renameNode(path, "bobsitems");
                    assert.isOk(dataMan.read.getLiveCopy("[1].menu.popup.bobsitems"))
                })

                it('rename array', function (){
                    var path = "[1].menu.popup";
                    dataMan.write.renameNode(path, "miles");
                    assert.isOk(dataMan.read.getLiveCopy("[1].menu.miles"))
                })
                it('rename object', function (){
                    var path = "[1].menu";
                    dataMan.write.renameNode(path, "miltons");
                    assert.isOk(dataMan.read.getLiveCopy("[1].miltons"))
                })
            })

            describe('addNode', function () {

                it ('base add random object', function (){
                    var newObjectNode = {"this": "that","subarray": [0,2,3], "subObject":{"minorval": "ds", "subval": "ds"}};
                    dataMan.write.addNode("[1].menu.popup", newObjectNode, "newObject");
                    assert.isOk(_.isEqual(dataMan.read.getLiveCopy("[1].menu.popup.newObject"), newObjectNode));

                })

                it ('base add single string value', function (){
                    var newObjectNode = "bob";
                    dataMan.write.addNode("[1].menu.popup", newObjectNode, "newObject");
                    assert.isOk(_.isEqual(dataMan.read.getLiveCopy("[1].menu.popup.newObject"), newObjectNode));

                })

                it ('base add number', function (){
                    var newObjectNode = 44;
                    dataMan.write.addNode("[1].menu.popup", newObjectNode, "newObject");
                    assert.isOk(_.isEqual(dataMan.read.getLiveCopy("[1].menu.popup.newObject"), newObjectNode));

                })
                it ('base add null', function (){
                    var newObjectNode = null;
                    dataMan.write.addNode("[1].menu.popup", newObjectNode, "newObject");
                    assert.isOk(_.isEqual(dataMan.read.getLiveCopy("[1].menu.popup.newObject"), newObjectNode));

                })
                it ('base add 0', function (){
                    var newObjectNode = 0;
                    dataMan.write.addNode("[1].menu.popup", newObjectNode, "newObject");
                    assert.isOk(_.isEqual(dataMan.read.getLiveCopy("[1].menu.popup.newObject"), newObjectNode));

                })

                it ('base add array', function (){
                    var newObjectNode = [0,1,2,3,4,5,6,7,8,9];
                    dataMan.write.addNode("[1].menu.popup", newObjectNode, "newObject");
                    assert.isOk(_.isEqual(dataMan.read.getLiveCopy("[1].menu.popup.newObject"), newObjectNode));

                })
                it ('base add complex object 1', function (){
                    var newObjectNode = [{val1:0,val2:1,val3:2},{val1:0,val2:1,val3:2},{val1:0,val2:1,val3:2},{val1:0,val2:1,val3:2}];
                    dataMan.write.addNode("[1].menu.popup", newObjectNode, "newObject");
                    assert.isOk(_.isEqual(dataMan.read.getLiveCopy("[1].menu.popup.newObject"), newObjectNode));

                })

                it ('base add complex object 2', function (){
                    var newObjectNode = {"this": "that",
                        "subarray": [0,2,3],
                        "another": {
                            "bob": [0, 101, 1],
                            "subBob": {"ack": "ack2"}
                        },
                        "subObject":{"minorval": "ds", "subval": "ds"}
                    };
                    dataMan.write.addNode("[1].menu.popup", newObjectNode, "newObject");
                    assert.isOk(_.isEqual(dataMan.read.getLiveCopy("[1].menu.popup.newObject"), newObjectNode));

                })

            })

            describe('modifyNode', function () {

            })

            describe('delNode', function () {

            });
        })

        it('has both data blocks', function () {
            assert.isOk(dataMan.read.liveJSON());
            assert.isOk(dataMan.read.lastJSON());
        })

        it('mirrors', function () {
            assert.isOk(_.isEqual(dataMan.read.liveJSON(), dataMan.read.lastJSON()));
        });

    });
});

