/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	
	'use strict';
	var moduleName = 'model.administration';
	
	/**
	 * @ngdoc controller
	 * @name modelAdministrationBlackListDetailController
	 * @function
	 * @requires $scope, platformContainerControllerService
	 *
	 * @description
	 * Controller for the details container of static highlighting schemes.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelAdministrationBlackListDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '3af9713a684b449aafe617272ba68ac9');
		}]);
})();