/**
 * Created by baf on 06.02.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardPlantCompatibleMaterialListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic card plantCompatibleMaterial entities.
	 **/

	angular.module(moduleName).controller('logisticCardPlantCompatibleMaterialListController', LogisticCardPlantCompatibleMaterialListController);

	LogisticCardPlantCompatibleMaterialListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticCardPlantCompatibleMaterialListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '47693dc497464c16ba9df74576724959');
	}
})(angular);