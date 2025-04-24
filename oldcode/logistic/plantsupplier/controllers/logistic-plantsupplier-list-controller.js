/**
 * Created by Shankar on 22.09.2020
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.plantsupplier';

	/**
	 * @ngdoc controller
	 * @name logisticPlantSupplierListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of plant supplier entities.
	 **/

	angular.module(moduleName).controller('logisticPlantSupplierListController', LogisticPlantSupplierListController);

	LogisticPlantSupplierListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPlantSupplierListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e3d637f3ac74405d9b1bb6ad9e657533');
	}
})(angular);