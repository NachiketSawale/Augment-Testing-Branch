/**
 * Created by baf on 28.02.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic price condition entities.
	 **/
	angular.module(moduleName).controller('logisticPriceConditionDetailController', LogisticPriceConditionDetailController);

	LogisticPriceConditionDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPriceConditionDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '24c4f1aecb6d4a5aa735201177521649');
	}

})(angular);