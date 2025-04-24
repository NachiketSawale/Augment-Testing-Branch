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

describe('Material Discount Group', function() {
	this.timeout(60000);
	var result = null;

	it('Put Material Discount Groups successfully', function (done) {
		var filePath = './basics/test/testdata/put-material-03-discount-group.json';
		var url = 'basics/publicapi/material/';
		util.requireData(filePath).then(function(data){
			util.post(url + 'putmaterialdiscountgroups', data).then(function (res) {
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