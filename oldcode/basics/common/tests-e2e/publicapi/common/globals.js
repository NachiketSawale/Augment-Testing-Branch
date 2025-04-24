/**
 * Created by lst on 10/17/2016.
 */

/* jshint -W117 */

/* globals global, require */
(function () {
	'use strict';

	global.globalConfig = {
		services: {
			host: 'localhost',
			port: 443,
			path: '/cloud5d/v1/services/'
		},
		identityServer: {
			host: 'itwo40-int.rib-software.com',
			port: 443,
			path: '/itwo40/identityserver/core/connect/token'
		},
		client: {
			authorization: '',
			clientContext: '{"signedInClientId":4,"clientId":479,"permissionClientId":1,"permissionRoleId":7,"dataLanguageId":1,"language":"en","culture":"en-gb"}',
			companyCode: '101'
		},
		loginData: {
			grant_type: 'password',
			username: 'ribadmin',
			password: 'ribadmin',
			client_id: 'iTWO.Cloud',
			client_secret: '{fec4c1a6-8182-4136-a1d4-81ad1af5db4a}',
			scope: 'default'
		},
		enableDebug: false
	};

	var path = require('path');

	global.globalRequire = {
		should: require(path.resolve('./node_modules/should')),
		util: require(path.resolve('./common/util'))
	};

}).call(this);