/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	const moduleName = 'model.measurements';

	/**
	 * @ngdoc controller
	 * @name modelMeasurementPointDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details container of measurement point.
	 **/

	angular.module(moduleName).controller('modelMeasurementPointDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '4c7ea712d06a42feae5926d17446986c');
		}]);
})();

