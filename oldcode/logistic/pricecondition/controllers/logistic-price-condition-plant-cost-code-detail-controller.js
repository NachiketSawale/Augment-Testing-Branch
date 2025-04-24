/**
 * Created by Nikhil on 31.08.2023
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionPlantCostCodeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic priceCondition CostCodeRate entities.
	 **/
	angular.module(moduleName).controller('logisticPriceConditionPlantCostCodeDetailController', LogisticPricePlantCostCodeDetailController);

	LogisticPricePlantCostCodeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPricePlantCostCodeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '28e3bcdb271d40f29c2f1a97683dc1ca');
	}

})(angular);