/**
 * Created by Shankar on 22.09.2020
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.plantsupplier';

	/**
	 * @ngdoc controller
	 * @name logisticPlantSupplierDetailController
	 * @function
	 *
	 * @description
	 * Controller for the list view of plant supplier entities.
	 **/

	angular.module(moduleName).controller('logisticPlantSupplierDetailController', LogisticPlantSupplierDetailController);

	LogisticPlantSupplierDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPlantSupplierDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ab47bC6a89d94ff5b6099ba32c4a584c');
	}
})(angular);
