/**
 * Created by baf on 13.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.sundryservice';

	/**
	 * @ngdoc controller
	 * @name logisticSundryServicePriceListDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic sundryService priceList entities.
	 **/
	angular.module(moduleName).controller('logisticSundryServicePriceListDetailController', LogisticSundryServicePriceListDetailController);

	LogisticSundryServicePriceListDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSundryServicePriceListDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '1f0839eeedb741cc9cbeb6f00266c6f8');
	}

})(angular);