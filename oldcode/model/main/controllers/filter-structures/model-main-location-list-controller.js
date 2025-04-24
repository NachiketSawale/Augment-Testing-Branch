/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	const moduleName = 'model.main';

	/**
	 * @ngdoc controller
	 * @name modelMainLocationListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of Location entities.
	 **/
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('modelMainLocationListController',
		ModelMainLocationListController);

	ModelMainLocationListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelMainLocationListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '24c2b0f8d3b146a38f42ad03d4c91b2f');
	}
})(angular);
