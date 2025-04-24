/**
 * Created by baf on 06.02.2023
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardPlantCompatibleMaterialDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic card plantCompatibleMaterial entities.
	 **/
	angular.module(moduleName).controller('logisticCardPlantCompatibleMaterialDetailController', LogisticCardPlantCompatibleMaterialDetailController);

	LogisticCardPlantCompatibleMaterialDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticCardPlantCompatibleMaterialDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '517e4033147a40bd8e2975297c9443e0');
	}

})(angular);