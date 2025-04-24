
(function (angular) {
	'use strict';

	var moduleName = 'project.assembly';
	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	/*
	 /**
	 * @ngdoc module
	 * @name project.assembly
	 * @description
	 * Module definition of the project assembly module
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