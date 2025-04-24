/**
 * Created by Shankar on 28.09.2022
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.plantsupplier';

	/**
	 * @ngdoc controller
	 * @name logisticPlantSupplyItemDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of plant supplier item entities.
	 **/
	angular.module(moduleName).controller('logisticPlantSupplyItemDetailController', LogisticPlantSupplyItemDetailController);

	LogisticPlantSupplyItemDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPlantSupplyItemDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5f1bee9c5ae844889ab4b40d47535a12');
	}

})(angular);

