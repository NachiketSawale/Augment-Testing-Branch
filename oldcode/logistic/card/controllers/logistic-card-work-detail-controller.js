/**
 * Created by shen on 6/9/2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardWorkDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic card work entities.
	 **/
	angular.module(moduleName).controller('logisticCardWorkDetailController', LogisticCardWorkDetailController);

	LogisticCardWorkDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticCardWorkDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '2b6ca1c9b58d48d397d1ae04d3725bb5');
	}

})(angular);