/**
 * Created by baf on 07.09.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionMaterialPriceListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic priceCondition materialPrice entities.
	 **/

	angular.module(moduleName).controller('logisticPriceConditionMaterialPriceListController', LogisticPriceConditionMaterialPriceListController);

	LogisticPriceConditionMaterialPriceListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPriceConditionMaterialPriceListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ef3955379c4447a3bda9264908229c8b');
	}
})(angular);