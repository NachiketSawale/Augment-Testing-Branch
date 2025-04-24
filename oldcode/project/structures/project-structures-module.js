/**
 * Created by joshi on 25.10.2016.
 */

(function (angular) {
	'use strict';

	var moduleName = 'project.structures';
	angular.module(moduleName, ['ui.router', 'project.main', 'cloud.common', 'ui.bootstrap', 'platform']);
	globals.modules.push(moduleName);

	/*
	 /**
	 * @ngdoc module
	 * @name project.structures
	 * @description
	 * Module definition of the project structures module
	 **/
	angular.module(moduleName).
		config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {
				var options = {
					'moduleName': moduleName
				};

				mainViewServiceProvider.registerModule(options);
			}
		]);

})(angular);