/**
 * Created by Shankar.
 */
(function () {

	'use strict';
	var moduleName = 'logistic.card';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name logisticCardActivityClerkDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant document entities
	 **/
	angModule.controller('logisticCardActivityClerkDetailController', LogisticCardActivityClerkDetailController);

	LogisticCardActivityClerkDetailController.$inject = ['$scope','platformContainerControllerService'];

	function LogisticCardActivityClerkDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'B51C43904B6E4FD8A1A40DBD2830D47D');

	}
})();