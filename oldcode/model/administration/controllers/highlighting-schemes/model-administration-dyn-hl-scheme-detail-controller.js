/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationDynHlSchemeDetailController
	 * @function
	 * @requires $scope, platformContainerControllerService
	 *
	 * @description
	 * Controller for the details container of dynamic highlighting schemes.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelAdministrationDynHlSchemeDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '227e5eab5efe472086262160515c91bb');
		}]);
})();