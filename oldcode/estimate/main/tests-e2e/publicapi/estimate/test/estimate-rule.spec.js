/* globals describe,it */
'use strict';

describe('Test Public API - EstimateRule', function () {
	let util = globalRequire.util;
	let should = globalRequire.should;
	let baseApiUrl = 'estimate/publicapi/rule/';

	describe('Get EstimateRule', function () {
		it('Get EstimateRule successfully', function (done) {
			this.timeout(60000);
			util.requireData('./estimate/test/testdata/get-estimate-rule.json').then(function (data) {
				util.post(baseApiUrl + '1.0/getestimaterules', data).then(function (res) {
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

	describe('Get EstimateRuleComplete', function () {
		it('Get EstimateRuleComplete successfully', function (done) {
			this.timeout(60000);
			util.requireData('./estimate/test/testdata/get-estimate-rule-complete.json').then(function (data) {
				util.post(baseApiUrl + '1.0/getestimaterulescomplete', data).then(function (res) {
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

});
