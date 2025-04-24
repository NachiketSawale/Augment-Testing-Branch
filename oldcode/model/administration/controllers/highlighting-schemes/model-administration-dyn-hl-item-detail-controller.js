/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationDynHlItemDetailController
	 * @function
	 * @requires $scope, platformContainerControllerService
	 *
	 * @description
	 * Controller for the details container of dynamic highlighting items.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelAdministrationDynHlItemDetailController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '18cc3cc979c24f7390607c9e45df177c');
		}]);
})();