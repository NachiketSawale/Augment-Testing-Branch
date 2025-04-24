/* globals describe,it*/
'use strict';

describe('Test Public API - ProcurementStructure', function () {
	var util = globalRequire.util;
	var should = globalRequire.should;
	var baseApiUrl = 'basics/publicapi/procurementstructure/';

	describe('Get ProcurementStructure', function () {
		it('Get ProcurementStructure successfully', function (done) {
			this.timeout(60000);
			util.requireData('./basics/test/testdata/get-procurement-structure.json').then(function (data) {
				util.post(baseApiUrl + '1.0/getprcstructure', data).then(function (res) {
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