/* global globalRequire,it,describe */

describe('Test Public API - CosMaster', function () {
	'use strict';

	var util = globalRequire.util;
	var baseApiUrl = 'constructionsystem/publicapi/';

	describe('Get Master', function () {
		it('Get Master successfully', function (done) {
			this.timeout(60000);
			util.requireData('./basics/test/testdata/cos-group-info.json').then(function (data) {
				util.post(baseApiUrl + '1.0/getCosMaster', data).then(function (res) {
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

	describe('Put Master', function () {

		it('Put Master successfully', function (done) {
			this.timeout(60000);
			util.requireData('./basics/test/testdata/cos-masters.json').then(function (data) {
				util.post(baseApiUrl + '2.0/putcosmaster', data).then(function () {
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