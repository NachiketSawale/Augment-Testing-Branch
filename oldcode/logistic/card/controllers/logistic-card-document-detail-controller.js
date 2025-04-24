/**
 * Created by henkel.
 */
(function () {

	'use strict';
	var moduleName = 'logistic.card';
	var angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name logisticCardDocumentDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details of plant document entities
	 **/
	angModule.controller('logisticCardDocumentDetailController', LogisticCardDocumentDetailController);

	LogisticCardDocumentDetailController.$inject = ['$scope','platformContainerControllerService'];

	function LogisticCardDocumentDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '4e3220847fe74ca6a726677f31ed9f05');

	}
})();