/**
 * Created by baf on 12.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionEquipmentCatalogPriceListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic priceCondition equipmentCatalogPrice entities.
	 **/

	angular.module(moduleName).controller('logisticPriceConditionEquipmentCatalogPriceListController', LogisticPriceConditionEquipmentCatalogPriceListController);

	LogisticPriceConditionEquipmentCatalogPriceListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPriceConditionEquipmentCatalogPriceListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'bc736a161cc248eaad95db451e06b541');
	}
})(angular);