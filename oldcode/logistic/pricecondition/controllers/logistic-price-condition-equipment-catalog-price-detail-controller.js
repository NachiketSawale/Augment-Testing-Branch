/**
 * Created by baf on 12.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionEquipmentCatalogPriceDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic priceCondition equipmentCatalogPrice entities.
	 **/
	angular.module(moduleName).controller('logisticPriceConditionEquipmentCatalogPriceDetailController', LogisticPriceConditionEquipmentCatalogPriceDetailController);

	LogisticPriceConditionEquipmentCatalogPriceDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPriceConditionEquipmentCatalogPriceDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '6e88700ea7a54efe805436ee4272ba99');
	}

})(angular);