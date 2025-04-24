/**
 * Created by shen on 9/4/2023
 */

(function (angular) {

	'use strict';
	let moduleName = 'logistic.settlement';

	/**
	 * @ngdoc controller
	 * @name logisticPostedDispHeaderUnsettledDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic posted dispatch header unsettled entities.
	 **/
	angular.module(moduleName).controller('logisticPostedDispHeaderUnsettledDetailController', LogisticPostedDispHeaderUnsettledDetailController);

	LogisticPostedDispHeaderUnsettledDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticPostedDispHeaderUnsettledDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ce8e55f36f5b490b870527018d2f8548');
	}

})(angular);