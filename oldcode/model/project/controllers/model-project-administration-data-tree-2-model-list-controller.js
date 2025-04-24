/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'model.project';

	/**
	 * @ngdoc controller
	 * @name modelProjectAdministrationDataTree2ModelListController
	 * @function
	 *
	 * @description
	 * Controller for the list container of data tree to model links.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelProjectAdministrationDataTree2ModelListController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '4541517fca60493cac556035d34d6209');
		}]);
})();