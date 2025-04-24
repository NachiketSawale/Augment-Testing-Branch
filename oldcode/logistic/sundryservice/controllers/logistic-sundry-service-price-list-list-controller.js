/**
 * Created by baf on 13.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.sundryservice';

	/**
	 * @ngdoc controller
	 * @name logisticSundryServicePriceListListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic sundryService priceList entities.
	 **/

	angular.module(moduleName).controller('logisticSundryServicePriceListListController', LogisticSundryServicePriceListListController);

	LogisticSundryServicePriceListListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSundryServicePriceListListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '014f9eb6e9cc4d8089bf7b7e1173d677');
	}
})(angular);