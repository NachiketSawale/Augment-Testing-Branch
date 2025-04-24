/**
 * Created by roberson (luo) on 2016/11/01.
 */

'use strict';

/* jshint -W117 */
/* jshint -W097 */
/* jshint -W098 */

/* globals require */
/* globals before */
/* globals describe */
/* globals it */

let fs = require('fs');
let path = require('path');
let util = require(path.resolve('./common/util'));
// let should = require(path.resolve('./node_modules/should'));


describe('Test Public API --> Assembly', function () {
	let webApiUrl = 'estimate/publicapi/assembly/putassembly';
	let requestData = null;

	before(function (done) {
		this.timeout(50000);
		fs.readFile(path.resolve('./estimate/test/testdata/put-03-assembly_composite-material.json.json'), 'utf8', function (error, data) {
			if (error) {
				done(error);
			} else {
				requestData = JSON.parse(data);
				// util.mergeLoginCompanyInfo(requestData);
				done();
			}
		});
	});

	it('import assemblies', function (done) {
		// console.log(requestData);
		// console.log(global.globalConfig);
		util.post(webApiUrl, requestData).then(function (response) {
			(response).should.not.have.ownProperty('errors');
			(response).should.not.have.ownProperty('Message');
			done();
		}, function (error) {
			done(error);
		});
	});

});
