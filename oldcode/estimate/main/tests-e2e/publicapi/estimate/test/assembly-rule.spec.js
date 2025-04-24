/* globals describe,it */
'use strict';

describe('Test Public API - AssemblyRule', function () {
	let util = globalRequire.util;
	let should = globalRequire.should;
	let baseApiUrl = 'estimate/publicapi/assembly/';

	describe('Put AssemblyRule', function () {
		it('Put AssemblyRule successfully', function (done) {
			this.timeout(60000);
			util.requireData('./estimate/test/testdata/put-assembly-rule.v2.json').then(function (data) {
				util.post(baseApiUrl + '2.0/putassemblyrule', data).then(function (res) {
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
