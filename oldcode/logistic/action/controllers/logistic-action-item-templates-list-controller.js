/**
 * Created by Shankar on 20.01.2025
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.action';

	/**
	 * @ngdoc controller
	 * @name logisticActionItemTemplatesListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic action Item Templates entities.
	 **/

	angular.module(moduleName).controller('logisticActionItemTemplatesListController', LogisticActionItemTemplatesListController);

	LogisticActionItemTemplatesListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticActionItemTemplatesListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '3172c5da049348609d8e54163f09e473');
	}
})(angular);