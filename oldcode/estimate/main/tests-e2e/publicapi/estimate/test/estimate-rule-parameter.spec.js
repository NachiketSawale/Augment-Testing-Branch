/* globals describe,it */
// eslint-disable-next-line strict
'use strict';

describe('Test Public API - EstimateRuleParameter', function () {
	let util = globalRequire.util;
	let should = globalRequire.should;
	let baseApiUrl = 'estimate/publicapi/rule/';

	describe('Get EstimateRuleParameter', function () {
		it('Get EstimateRuleParameter successfully', function (done) {
			this.timeout(60000);
			util.requireData('./estimate/test/testdata/get-estimate-rule-parameter.json').then(function (data) {
				util.post(baseApiUrl + '1.0/getestimateruleparameters', data).then(function (res) {
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
