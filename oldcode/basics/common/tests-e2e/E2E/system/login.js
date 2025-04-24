/**
 * Created by lja on 04/23/2015.
 */
'use strict';

var api = require('framework').api;

describe('login in project', function () {

	var kw;
	beforeEach(function () {
		kw = api.createNewAPI();
		kw.mockHttpIntecptor();
	});

	it('login in project and select a company role', function () {
		var login = api.createNewAPI();

		login.login();
		// login.companyRole();
		login.companyRoleWithoutTree();
	});
});
