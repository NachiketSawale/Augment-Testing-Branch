/**
 * Created by jes on 10/28/2016.
 */

/* jshint -W097*/
/* jshint -W098*/
/* jshint -W106*/
/* jshint -W117*/
/* globals describe,before,beforeEach,it,require*/

'use strict';

describe('Test Public API - UoM', function () {

	var util = globalRequire.util;
	var should = globalRequire.should;
	var baseApiUrl = 'basics/publicapi/unit/';

	describe('Check UoM', function () {

		it('Check UoM Use Promise', function () {
			this.timeout(60000);
			return util.requireData('./basics/test/testdata/check-uom.json').then(function (data) {
				return util.post(baseApiUrl + 'checkUoM', data);
			});
		});

		it('Check UoM Use Done', function (done) {
			this.timeout(60000);
			util.requireData('./basics/test/testdata/check-uom.json').then(function (data) {
				util.post(baseApiUrl + 'checkUoM', data).then(function (res) {
					(res).should.be.ok();
					done();
				}, function (err) {
					done(err);
				});
			}, function (err) {
				done(err);
			});
		});
	});

	describe('Import UoM', function () {

		var jsonFile = './basics/test/testdata/put-uom.json';
		it('should save the UoMs successfully', function (done) {
			this.timeout(60000);
			util.requireData(jsonFile).then(function (data) {
				var request = Object.assign({}, data, {canOverwrite: true});
				util.post(baseApiUrl + 'putuoms', request).then(function () {
					done();
				}, function (err) {
					done(err);
				});
			}, function (err) {
				done(err);
			});
		});

	});
});

