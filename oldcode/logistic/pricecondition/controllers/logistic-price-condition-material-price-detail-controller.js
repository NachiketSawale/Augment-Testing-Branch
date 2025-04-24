/**
 * Created by baf on 07.09.2022
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionMaterialPriceDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic priceCondition materialPrice entities.
	 **/
	angular.module(moduleName).controller('logisticPriceConditionMaterialPriceDetailController', LogisticPriceConditionMaterialPriceDetailController);

	LogisticPriceConditionMaterialPriceDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPriceConditionMaterialPriceDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '39f4db632f194d0bb918fc8981f1011e');
	}

})(angular);