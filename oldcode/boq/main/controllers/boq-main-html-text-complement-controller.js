(function () {

	'use strict';
	var moduleName = 'boq.main';

	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 *
	 * @description
	 *
	 **/
	angModule.controller('boqMainHtmlTextComplementController',
		['$scope',
			'boqMainService',
			'boqMainTextComplementControllerFactory',
			function ($scope,
				boqService,
				controllerServiceFactory) {

				controllerServiceFactory.initController($scope, boqService, moduleName);

			}
		]);
})();
