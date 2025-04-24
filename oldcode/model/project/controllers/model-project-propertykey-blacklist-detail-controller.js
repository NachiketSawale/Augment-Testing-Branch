/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	
	'use strict';
	var moduleName = 'model.project';
	
	/**
	 * @ngdoc controller
	 * @name modelProjectPropertyKeyBlackListDetailController
	 * @function
	 * @requires $scope, platformContainerControllerService
	 *
	 * @description
	 * Controller for the details container of static highlighting schemes.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelProjectPropertyKeyBlackListDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '5511a01cf9f94875bdb51f48d4bdebfa');
		}]);
})();