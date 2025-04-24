/**
 * Created by Shankar on 28.09.2022
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.plantsupplier';

	/**
	 * @ngdoc controller
	 * @name logisticPlantSupplyItemListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of plant supplier item entities.
	 **/

	angular.module(moduleName).controller('logisticPlantSupplyItemListController', LogisticPlantSupplyItemListController);

	LogisticPlantSupplyItemListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPlantSupplyItemListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6b48b5efc7074d6b970212972b484139');
	}
})(angular);