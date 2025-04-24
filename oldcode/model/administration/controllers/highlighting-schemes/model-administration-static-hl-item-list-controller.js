/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationStaticHlItemListController
	 * @function
	 * @requires $scope, platformContainerControllerService
	 *
	 * @description
	 * Controller for the list container of static highlighting items.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelAdministrationStaticHlItemListController', ['$scope',
		'platformContainerControllerService',
		function ($scope, platformContainerControllerService) {
			platformContainerControllerService.initController($scope, moduleName, '325a35cc5b0c4c2184d3f5eb72c58f5a');
		}]);
})();