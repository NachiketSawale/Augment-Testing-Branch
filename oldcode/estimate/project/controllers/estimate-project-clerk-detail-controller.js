/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	const moduleName = 'estimate.project';

	/**
     * @ngdoc controller
     * @name estimateProjectClerkDetailController
     * @function
     *
     * @description
     * Controller for the detail view of estimate project clerk entities.
     **/
	angular.module(moduleName).controller('estimateProjectClerkDetailController', estimateProjectClerkDetailController);

	estimateProjectClerkDetailController.$inject = ['$scope', 'platformContainerControllerService'];

	function estimateProjectClerkDetailController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'a8eceb9f41f8475fa35b876a642c22d5');
	}

})(angular);