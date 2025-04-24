/**
 * Created by baf on 12.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionPlantPriceDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic priceCondition plantPrice entities.
	 **/
	angular.module(moduleName).controller('logisticPriceConditionPlantPriceDetailController', LogisticPriceConditionPlantPriceDetailController);

	LogisticPriceConditionPlantPriceDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPriceConditionPlantPriceDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'dc76760660e9466da30b5a7116fc2f52');
	}

})(angular);