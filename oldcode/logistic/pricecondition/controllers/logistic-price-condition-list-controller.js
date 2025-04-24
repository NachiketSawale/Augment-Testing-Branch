/**
 * Created by baf on 28.02.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic price condition entities.
	 **/

	angular.module(moduleName).controller('logisticPriceConditionListController', LogisticPriceConditionListController);

	LogisticPriceConditionListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPriceConditionListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '5d0e37f033664ce6b0faf2114db0906a');
	}
})(angular);