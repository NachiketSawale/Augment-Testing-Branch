/* globals describe,it */
'use strict';

describe('Test Public API - EstimateRuleScript', function () {
	let util = globalRequire.util;
	let should = globalRequire.should;
	let baseApiUrl = 'estimate/publicapi/rule/';

	describe('Get EstimateRuleScript', function () {
		it('Get EstimateRuleScript successfully', function (done) {
			this.timeout(60000);
			util.requireData('./estimate/test/testdata/get-estimate-rule-script.json').then(function (data) {
				util.post(baseApiUrl + '1.0/getestimaterulescripts', data).then(function (res) {
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
