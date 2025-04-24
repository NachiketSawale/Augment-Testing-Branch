/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'project.material';
	angular.module(moduleName, ['ui.router', 'basics.material', 'basics.lookupdata', 'cloud.common', 'ui.bootstrap', 'platform']);
	globals.modules.push(moduleName);

	/*
	 /**
	 * @ngdoc module
	 * @name project.material
	 * @description
	 * Module definition of the project material module
	 **/
	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {
				let options = {
					'moduleName': moduleName
				};

				mainViewServiceProvider.registerModule(options);
			}
		]);

})(angular);