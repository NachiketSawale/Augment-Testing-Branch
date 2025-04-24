/**
 * Created by baf on 18.03.2019
 */

(function (angular) {

	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of logistic card card entities.
	 **/
	angular.module(moduleName).controller('logisticCardDetailController', LogisticCardDetailController);

	LogisticCardDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticCardDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'b3cd04f14e0d4c37a17255d3315f2e0e');
	}

})(angular);