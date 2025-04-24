/**
 * Created by baf on 18.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic card card entities.
	 **/

	angular.module(moduleName).controller('logisticCardListController', LogisticCardListController);

	LogisticCardListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticCardListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '05fd352d74ef4f5aa179d259e056c367');
	}
})(angular);