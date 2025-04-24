/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let moduleName = 'estimate.project';

	/**
     * @ngdoc controller
     * @name estimateProjectClerkListController
     * @function
     *
     * @description
     * Controller for the detail view of estimate project clerk entities.
     **/
	angular.module(moduleName).controller('estimateProjectClerkListController', estimateProjectClerkListController);

	estimateProjectClerkListController.$inject = ['$scope', 'platformContainerControllerService'];

	function estimateProjectClerkListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'bceaa9e8a4f04e5797e87871078e6edc');
	}

})(angular);