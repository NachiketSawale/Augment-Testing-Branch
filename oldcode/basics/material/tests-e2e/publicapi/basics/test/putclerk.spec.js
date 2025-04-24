/**
 * Created by chi on 9/11/2017.
 */

/* jshint -W097*/
/* jshint -W098*/
/* jshint -W106*/
/* jshint -W117*/
/* globals require*/

'use strict';

var path=require('path');

var util = require(path.resolve('./common/util'));
var	should = require(path.resolve('./node_modules/should'));
var q = require(path.resolve('./node_modules/q'));
const fs = require('fs');

describe('Put Clerk', function() {
    this.timeout(600000);
    var result = null;

    it('Put Clerk successfully', function (done) {
        var filePath = './basics/test/testdata/put-clerk.json';
        var url = 'basics/publicapi/clerk/';
        util.requireData(filePath).then(function (data) {
            console.log('read json file');
            fs.readFile('./basics/test/testdata/Picture4.png', function (err, bytes) {
                console.log('read image file');
                data.blobsPhoto = bufferToBytes(bytes);
                console.log(bytes);
                console.log(data.blobsPhoto);
                util.post(url + '1.0/update', data).then(function (res) {
                    console.log('update data');
                    result = res;
                    done();
                }, function (err) {
                    done(err);
                });
            });
        }, function (err) {
            done(err);
            console.log(err);
        });
    });
});

function base64ToBytes(str) {
    var commaPos = str.indexOf(',');
    var temp = str.substring(++commaPos);
    var tempCh = null;
    var tempst = null;
    var result = null;
    for (var i = 0; i < temp.length; ++i) {
        tempCh = str.charCodeAt(i);
        tempst = [];
        do {
            tempst.push(tempCh & 0xFF);
            tempCh = tempCh >> 8;
        }
        while (tempCh);
        result = result.concat(tempst.reverse());
    }
    return result;
}