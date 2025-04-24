/**
 * Created by welss on 12.04.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.job';

	/**
	 * @ngdoc controller
	 * @name logisticJobTaskListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic job task entities.
	 **/

	angular.module(moduleName).controller('logisticJobTaskListController', LogisticJobTaskListController);

	LogisticJobTaskListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticJobTaskListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '0a4b9b45b59445c9b536b1d20fb40be8');
	}
})(angular);