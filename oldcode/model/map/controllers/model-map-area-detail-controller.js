/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	
	'use strict';
	var moduleName = 'model.map';
	
	/**
	 * @ngdoc controller
	 * @name modelMapAreaDetailController
	 * @function
	 * @requires $scope, platformContainerControllerService
	 *
	 * @description
	 * Controller for the detail container of map areas.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelMapAreaDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '86480935d53747df8974e5341d9aabb2');
		}]);
})();