/**
 * Created by ada on 2016/10/28.
 */
'use strict';

/* globals describe,before,beforeEach,it,require */

let util = globalRequire.util;
let should = globalRequire.should;
let baseApiUrl = './estimate/publicapi/assembly/';

describe('Import Assembly Catalogs', function(){

	let util = globalRequire.util;
	let should = globalRequire.should;

	this.timeout(30000);
	let url = baseApiUrl + 'putAssemblyCatalogs';
	let jsonFile = './estimate/test/testdata/put-01-assembly-catalog_composite-material.json';

	it('save the assembly catalogs (composite-material) successfully', function (done) {
		util.requireData(jsonFile).then(function (data) {
			let request = Object.assign({}, data, {canOverwrite: true});
			util.post(url, request).then(function () {
				done();
			}, function (err) {
				done(err);
			});
		}, function (err) {
			done(err);
		});
	});

	jsonFile = './estimate/test/testdata/put-02-assembly-catalog_quantum-norm.json';
	it('save the assembly catalogs (quantum-norm) successfully', function (done) {
		util.requireData(jsonFile).then(function (data) {
			let request = Object.assign({}, data, {canOverwrite: true});
			util.post(url, request).then(function () {
				done();
			}, function (err) {
				done(err);
			});
		}, function (err) {
			done(err);
		});
	});
});
