/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	const moduleName = 'model.measurements';

	/**
	 * @ngdoc controller
	 * @name modelMeasurementDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details container of measurement.
	 **/

	angular.module(moduleName).controller('modelMeasurementDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '82a0d97bcd4842d9b2d5460b05473158');
		}]);
})();
