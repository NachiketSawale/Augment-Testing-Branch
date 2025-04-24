/**
 * Created by baf on 24.08.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionCostCodeRateListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic priceCondition CostCodeRate entities.
	 **/

	angular.module(moduleName).controller('logisticPriceConditionCostCodeRateListController', LogisticPriceConditionCostCodeRateListController);

	LogisticPriceConditionCostCodeRateListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPriceConditionCostCodeRateListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e07d54925ba64e7db4928907939e1bda');
	}
})(angular);