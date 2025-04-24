/**
 * Created by baf on 24.08.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionCostCodeRateDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic priceCondition CostCodeRate entities.
	 **/
	angular.module(moduleName).controller('logisticPriceConditionCostCodeRateDetailController', LogisticPriceConditionCostCodeRateDetailController);

	LogisticPriceConditionCostCodeRateDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPriceConditionCostCodeRateDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'e37b49b2796d4950bd7c54dfaf6cf86a');
	}

})(angular);