/**
 * Created by cakiral on 03.02.2022
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'logistic.sundrygroup';

	/**
	 * @ngdoc controller
	 * @name logisticSundryGroupTaxCodeDetailController
	 * @function
	 * 
	 * @description
	 * Controller for the list view of Logistic SundryGroup TaxCode entities.
	 **/

	angular.module(moduleName).controller('logisticSundryGroupTaxCodeDetailController', LogisticSundryGroupTaxCodeDetailController);

	LogisticSundryGroupTaxCodeDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSundryGroupTaxCodeDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '0a1129006edb4425a610dd413a853a10');
	}
})(angular);