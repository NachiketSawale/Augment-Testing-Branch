/**
 * Created by balkanci on 06.11.2014.
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.lookupdata';

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
