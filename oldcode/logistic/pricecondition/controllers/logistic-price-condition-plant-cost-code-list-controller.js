/**
 * Created by Nikhil on 31.08.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionPlantCostCodeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic priceCondition plantCostCode entities.
	 **/

	angular.module(moduleName).controller('logisticPriceConditionPlantCostCodeListController', LogisticPriceConditionPlantCostCodeListController);

	LogisticPriceConditionPlantCostCodeListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPriceConditionPlantCostCodeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '767c6e762ece45f6bedf133f02e9baa3');
	}
})(angular);