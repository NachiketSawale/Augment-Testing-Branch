/**
 * Created by jes on 10/28/2016.
 */

/* jshint -W097*/
/* jshint -W098*/
/* jshint -W106*/
/* jshint -W117*/
/* globals require,describe,it */

'use strict';

describe('Import Material Catalog', function () {

	var util = globalRequire.util;
	var should = globalRequire.should;

	this.timeout(60000);
	var url = 'basics/publicapi/material/1.0/putmaterialcatalogs';
	var jsonFile = './basics/test/testdata/put-material-01-catalog.json';

	it('should save the MaterialCatalogs successfully', function (done) {
		util.requireData(jsonFile).then(function (data) {
			var request = Object.assign({}, data, {canOverwrite: true});
			util.post(url, request).then(function () {
				done();
			}, function (err) {
				done(err);
			});
		}, function (err) {
			done(err);
		});
	});
});