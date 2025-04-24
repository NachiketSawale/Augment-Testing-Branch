/**
 * $Id:
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {

	'use strict';
	const moduleName = 'model.project';

	/**
	 * @ngdoc controller
	 * @name modelProjectClerkDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of model project clerk entities.
	 **/
	angular.module(moduleName).controller('modelProjectClerkDetailController', modelProjectClerkDetailController);

	modelProjectClerkDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function modelProjectClerkDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '32942b95e0e441e392a69c73361023cb');
	}

})(angular);