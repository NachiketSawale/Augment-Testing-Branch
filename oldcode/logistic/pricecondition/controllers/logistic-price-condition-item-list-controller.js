/**
 * Created by baf on 01.03.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.pricecondition';

	/**
	 * @ngdoc controller
	 * @name logisticPriceConditionItemListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic price condition item entities.
	 **/

	angular.module(moduleName).controller('logisticPriceConditionItemListController', LogisticPriceConditionListItemController);

	LogisticPriceConditionListItemController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPriceConditionListItemController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'bc0c1a5bc4dc420d98bd85a0eeac59f4');
	}
})(angular);