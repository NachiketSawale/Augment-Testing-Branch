/**
 * Created by wed on 9/21/2017.
 */

/* globals describe,it*/
'use strict';

describe('Test Public API - Company',function () {
	var util = globalRequire.util;
	var baseApiUrl = 'basics/publicapi/company/';

	describe('Import Company',function () {
		var jsonFile = './basics/test/testdata/put-company.json';
		it('should save the companies sucessfully',function (done) {
			this.timeout(60000);
			util.requireData(jsonFile).then(function (data) {
				util.post(baseApiUrl + '1.0/put', data).then(function () {
					done();
				}, function (err) {
					done(err);
				});
			},function (err) {
				done(err);
			});
		});
	});
});