/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	const moduleName = 'model.measurements';

	/**
	 * @ngdoc controller
	 * @name modelMeasurementGroupDetailController
	 * @function
	 *
	 * @description
	 * Controller for the details container of measurement group.
	 **/

	angular.module(moduleName).controller('modelMeasurementGroupDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '65195e08535840448858c60b59b44bcf');
		}]);
})();

