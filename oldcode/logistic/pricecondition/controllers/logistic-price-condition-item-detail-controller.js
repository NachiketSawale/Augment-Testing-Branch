/**
 * Created by baf on 01.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic price  entities.
	 **/
	angular.module(moduleName).controller('logisticPriceConditionItemDetailController', LogisticPriceConditionItemDetailController);

	LogisticPriceConditionItemDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPriceConditionItemDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '96e91752e0ca46f59eb4b332fb6573b4');
	}

})(angular);