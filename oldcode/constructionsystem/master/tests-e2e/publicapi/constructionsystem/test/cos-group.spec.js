/* globals describe,it,globalRequire */

describe('Test Public API - CosGroup', function () {
	'use strict';

	var util = globalRequire.util;
	// var should = globalRequire.should;
	var baseApiUrl = 'constructionsystem/publicapi/';

	describe('Get CosGroup', function () {
		it('Get CosGroup successfully', function (done) {
			this.timeout(60000);
			util.requireData('./constructionsystem/test/testdata/cos-group-company.json').then(function (data) {
				util.post(baseApiUrl + '1.0/getCosGroup', data).then(function (res) {
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

	describe('Put CosGroup', function () {
		it('Put CosGroup successfully', function (done) {
			this.timeout(60000);
			util.requireData('./constructionsystem/test/testdata/cos-groups.json').then(function (data) {
				util.post(baseApiUrl + '2.0/putcosgroup', data).then(function (/* res */) {
					// (res).should.be.ok();
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