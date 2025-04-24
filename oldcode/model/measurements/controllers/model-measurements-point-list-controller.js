/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	const moduleName = 'model.measurements';

	/**
	 * @ngdoc controller
	 * @name modelMeasurementPointListController
	 * @function
	 *
	 * @description
	 * Controller for the list container of measurement point.
	 **/

	angular.module(moduleName).controller('modelMeasurementPointListController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '8c8f48d17387402694b8359bef7bde6d');
		}]);
})();