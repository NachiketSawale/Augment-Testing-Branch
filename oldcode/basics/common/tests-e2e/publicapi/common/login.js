/**
 * Created by lst on 10/14/2016.
 */

/* jshint -W097 */
/* jshint -W098 */
/* jshint -W106 */
/* jshint -W117 */
/* globals require */

'use strict';

var path = require('path');

var util = require(path.resolve('./common/util'));
var should = require(path.resolve('./node_modules/should'));

before(function (done) {
	this.timeout(50000);
	util.login().then(function (res) {
		globalConfig.client.authorization = res.token_type + ' ' + res.access_token;
		done();
	});
});

describe('Do Login', function () {
	it('login success', function (done) {
		globalConfig.client.authorization.should.be.a.String();
		done();
	});
});