/**
 * Created by baf on 12.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionMaterialCatalogPriceListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic priceCondition materialCatalogPrice entities.
	 **/

	angular.module(moduleName).controller('logisticPriceConditionMaterialCatalogPriceListController', LogisticPriceConditionMaterialCatalogPriceListController);

	LogisticPriceConditionMaterialCatalogPriceListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPriceConditionMaterialCatalogPriceListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'bd261e0906984702a6d01964ffc58bcc');
	}
})(angular);