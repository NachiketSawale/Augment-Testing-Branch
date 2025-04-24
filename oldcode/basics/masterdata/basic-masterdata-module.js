/*
 * $Id: basic-masterdata-module.js 467801 2017-11-13 12:55:59Z kh $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var moduleName = 'basics.masterdata';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 /**
	 * @ngdoc module
	 * @name basics.lookupData
	 * @description
	 * Module definition of the basics module
	 **/
	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (platformLayoutService) {
				platformLayoutService.registerModule(moduleName);
			}
		]);
})(angular);
