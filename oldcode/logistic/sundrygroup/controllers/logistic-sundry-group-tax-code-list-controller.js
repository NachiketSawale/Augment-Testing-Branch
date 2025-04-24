/**
 * Created by cakiral on 03.02.2022
 */

(function (angular) {
	/* global globals _ */
	'use strict';
	let moduleName = 'logistic.sundrygroup';

	/**
	 * @ngdoc controller
	 * @name logisticSundryGroupTaxCodeListController
	 * @function
	 * 
	 * @description
	 * Controller for the list view of Logistic SundryGroup TaxCode entities.
	 **/

	angular.module(moduleName).controller('logisticSundryGroupTaxCodeListController', LogisticSundryGroupTaxCodeListController);

	LogisticSundryGroupTaxCodeListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticSundryGroupTaxCodeListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '53ee04a365cc4110a06e44c00d39ddf9');
	}
})(angular);