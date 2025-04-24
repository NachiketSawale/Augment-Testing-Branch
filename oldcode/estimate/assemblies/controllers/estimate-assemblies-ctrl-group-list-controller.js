
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	let moduleName = 'estimate.assemblies',
		angModule = angular.module(moduleName);

	/**
	 * @ngdoc controller
	 * @name estimateAssembliesCtrlGroupListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of entity entities.
	 **/
	angModule.controller('estimateAssembliesCtrlGroupListController',
		['$scope', 'platformContainerControllerService',
			function ($scope, platformContainerControllerService) {

				platformContainerControllerService.initController($scope, moduleName, '588BE3EE73E94971A1C7A0BC7867C6BD');
			}]);
})();
