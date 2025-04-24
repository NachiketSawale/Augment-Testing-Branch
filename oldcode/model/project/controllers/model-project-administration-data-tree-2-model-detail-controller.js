/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'model.project';

	/**
	 * @ngdoc controller
	 * @name modelProjectAdministrationDataTree2ModelDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details container of data tree to model links.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelProjectAdministrationDataTree2ModelDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, 'db96f2a2b9d546dca4f339e2305f00e7');
		}]);
})();