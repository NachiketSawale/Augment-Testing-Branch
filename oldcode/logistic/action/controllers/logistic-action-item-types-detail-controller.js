/**
 * Created by Shankar on 20.01.2025
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.action';

	/**
	 * @ngdoc controller
	 * @name logisticActionItemTypesDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic action item types entities.
	 **/
	angular.module(moduleName).controller('logisticActionItemTypesDetailController', LogisticActionItemTypesDetailController);

	LogisticActionItemTypesDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticActionItemTypesDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '0ea726bc027d48d9a047f716f5dad752');
	}

})(angular);

