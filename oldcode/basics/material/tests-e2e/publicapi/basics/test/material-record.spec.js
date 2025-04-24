/**
 * Created by chi on 11/1/2016.
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
const fs = require('fs');

describe('Material Record', function() {
	this.timeout(60000);
	var result = null;

	it('Put Material Records successfully', function (done) {
		var filePath = './basics/test/testdata/put-material-04-01.json';
		var url = 'basics/publicapi/material/';
		util.requireData(filePath).then(function(data){
			util.post(url + 'putmaterialrecords', data).then(function (res) {
				result = res;
				done();
			}, function (err) {
				done(err);
			});
		},function(err) {
			done(err);
		});
	});
});