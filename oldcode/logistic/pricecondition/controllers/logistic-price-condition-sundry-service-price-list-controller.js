/**
 * Created by baf on 12.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionSundryServicePriceListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic priceCondition sundryServicePrice entities.
	 **/

	angular.module(moduleName).controller('logisticPriceConditionSundryServicePriceListController', LogisticPriceConditionSundryServicePriceListController);

	LogisticPriceConditionSundryServicePriceListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPriceConditionSundryServicePriceListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '76206e93e60a4f60a71fd0d0961c6da1');
	}
})(angular);