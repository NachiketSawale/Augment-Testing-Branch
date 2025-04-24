/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'productionplanning.formworktype';

	/**
	 * @ngdoc controller
	 * @name productionplanningFormworktypeDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of formwork type entities.
	 **/

	angular.module(moduleName).controller('productionplanningFormworktypeDetailController', DetailController);

	DetailController.$inject = ['$scope', 'platformContainerControllerService', 'productionplanningFormworktypeConstantValues'];

	function DetailController($scope, platformContainerControllerService, constantValues) {
		platformContainerControllerService.initController($scope, moduleName, constantValues.uuid.container.formworktypeDetails);
	}

})(angular);
