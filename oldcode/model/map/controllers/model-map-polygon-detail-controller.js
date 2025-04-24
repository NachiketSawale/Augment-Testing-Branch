/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	
	'use strict';
	var moduleName = 'model.map';
	
	/**
	 * @ngdoc controller
	 * @name modelMapPolygonDetailController
	 * @function
	 * @requires $scope, platformContainerControllerService
	 *
	 * @description
	 * Controller for the detail container of map polygons.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelMapPolygonDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '12fe6a7a85af40ed8ce3125a3bef7442');
		}]);
})();