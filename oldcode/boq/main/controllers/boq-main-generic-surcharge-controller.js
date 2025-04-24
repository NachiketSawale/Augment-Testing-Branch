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
	angModule.controller('boqMainGenericSurchargeController', [
		'$scope',
		'$injector',
		'boqMainSurchargeControllerFactory',
		function ($scope,
			$injector,
			boqMainSurchargeControllerFactory) {

			// get environment from the module-container.json file
			var boqMainServiceName = $scope.getContentValue('boqService');
			var boqMainService = $injector.get(boqMainServiceName);
			var moduleName = $scope.getContentValue('moduleName');

			boqMainSurchargeControllerFactory.initController($scope, boqMainService, moduleName);

		}
	]);
})();
