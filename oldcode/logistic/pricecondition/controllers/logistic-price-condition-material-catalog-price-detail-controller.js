/**
 * Created by baf on 12.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionMaterialCatalogPriceDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic priceCondition materialCatalogPrice entities.
	 **/
	angular.module(moduleName).controller('logisticPriceConditionMaterialCatalogPriceDetailController', LogisticPriceConditionMaterialCatalogPriceDetailController);

	LogisticPriceConditionMaterialCatalogPriceDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPriceConditionMaterialCatalogPriceDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '00c2aee866bc4607b3824ea4e05700b6');
	}

})(angular);