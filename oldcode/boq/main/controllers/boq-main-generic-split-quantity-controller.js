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
	angModule.controller('boqMainGenericSplitQuantityController', [
		'$scope',
		'$injector',
		'boqMainSplitQuantityControllerFactory',
		function ($scope,
			$injector,
			controllerServiceFactory) {

			// get environment from the module-container.json file
			var boqServiceName = $scope.getContentValue('boqService');
			var boqService = $injector.get(boqServiceName);
			var moduleName = $scope.getContentValue('moduleName');
			controllerServiceFactory.initController($scope, boqService, moduleName);

		}
	]);
})();
