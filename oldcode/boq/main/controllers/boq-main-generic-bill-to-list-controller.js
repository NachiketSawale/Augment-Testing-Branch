/**
 * Created by bh on 28.05.2020
 */

(function () {
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc controller
	 * @name boqMainBillToListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of boq main billTo entities.
	 **/

	angular.module(moduleName).controller('boqMainGenericBillToListController', [
		'$scope',
		'$injector',
		'boqMainBillToControllerFactory',
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
