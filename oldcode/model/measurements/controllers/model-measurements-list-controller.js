/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	const moduleName = 'model.measurements';

	/**
	 * @ngdoc controller
	 * @name modelMeasurementListController
	 * @function
	 *
	 * @description
	 * Controller for the list container of measurements.
	 **/

	angular.module(moduleName).controller('modelMeasurementListController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '1b72a5f32b6646e8b5358653fcc51a77');
		}]);
})();
