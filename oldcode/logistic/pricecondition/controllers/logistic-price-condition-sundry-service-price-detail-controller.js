/**
 * Created by baf on 12.03.2018
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionSundryServicePriceDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic priceCondition sundryServicePrice entities.
	 **/
	angular.module(moduleName).controller('logisticPriceConditionSundryServicePriceDetailController', LogisticPriceConditionSundryServicePriceDetailController);

	LogisticPriceConditionSundryServicePriceDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPriceConditionSundryServicePriceDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '9eefecb804a840e0bcefd6825c957374');
	}

})(angular);