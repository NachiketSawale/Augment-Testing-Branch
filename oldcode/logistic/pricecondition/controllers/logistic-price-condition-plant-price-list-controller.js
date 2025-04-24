/**
 * Created by baf on 12.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionPlantPriceListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic priceCondition plantPrice entities.
	 **/

	angular.module(moduleName).controller('logisticPriceConditionPlantPriceListController', LogisticPriceConditionPlantPriceListController);

	LogisticPriceConditionPlantPriceListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPriceConditionPlantPriceListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2934c2d1160447bc860cc5c3897e4d9f');
	}
})(angular);