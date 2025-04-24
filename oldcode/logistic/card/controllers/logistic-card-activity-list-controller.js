/**
 * Created by baf on 18.03.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.card';

	/**
	 * @ngdoc controller
	 * @name logisticCardActivityListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of logistic card activity entities.
	 **/

	angular.module(moduleName).controller('logisticCardActivityListController', LogisticCardActivityListController);

	LogisticCardActivityListController.$inject = ['$scope', 'platformContainerControllerService'];

	function LogisticCardActivityListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '8a2db2fa260e476a8928c2a56791b277');
	}
})(angular);