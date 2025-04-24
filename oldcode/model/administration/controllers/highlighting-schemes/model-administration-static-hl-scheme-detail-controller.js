/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationStaticHlSchemeDetailController
	 * @function
	 * @requires $scope, platformContainerControllerService
	 *
	 * @description
	 * Controller for the details container of static highlighting schemes.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelAdministrationStaticHlSchemeDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '1aa62e964ad34df6a9eb71484a0188fb');
		}]);
})();