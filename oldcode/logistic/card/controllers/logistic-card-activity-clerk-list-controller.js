/**
 * Created by Shankar on 11.08.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardActivityClerkListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic card clerk entities.
	 **/

	angular.module(moduleName).controller('logisticCardActivityClerkListController', LogisticCardActivityClerkListController);

	LogisticCardActivityClerkListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticCardActivityClerkListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'ecc6bbcf8be84e5e84e6ed2b2a2497a7');
	}
})(angular);