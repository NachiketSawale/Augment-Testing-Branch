/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	
	'use strict';
	var moduleName = 'model.map';
	
	/**
	 * @ngdoc controller
	 * @name modelMapAreaListController
	 * @function
	 * @requires $scope, platformContainerControllerService
	 *
	 * @description
	 * Controller for the list container of map areas.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelMapAreaListController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, 'a8a7ae07b8834324bcc2cee437170d2a');
		}]);
})();