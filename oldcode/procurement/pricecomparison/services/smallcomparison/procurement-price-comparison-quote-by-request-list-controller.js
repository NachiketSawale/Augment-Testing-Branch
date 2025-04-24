/**
 * Created by baf on 20.11.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc controller
	 * @name procurementPriceComparisonQuoteByRequestListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of procurement priceComparison smallComparison entities.
	 **/

	angular.module(moduleName).controller('procurementPriceComparisonQuoteByRequestListController', ProcurementPriceComparisonQuoteByRequestListController);

	ProcurementPriceComparisonQuoteByRequestListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ProcurementPriceComparisonQuoteByRequestListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'deb620733c7e494b8f4d261c4aa01c6b');
	}
})(angular);