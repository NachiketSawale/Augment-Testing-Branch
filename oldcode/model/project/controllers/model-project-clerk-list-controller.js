/**
 * $Id:
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {

	'use strict';
	let moduleName = 'model.project';

	/**
	 * @ngdoc controller
	 * @name modelProjectClerkListController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of model project clerk entities.
	 **/
	angular.module(moduleName).controller('modelProjectClerkListController', modelProjectClerkListController);

	modelProjectClerkListController.$inject = ['$scope', 'platformContainerControllerService'];

	function modelProjectClerkListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '70ce0ba51f5545fdabb81be621cfa2c5');
	}

})(angular);
