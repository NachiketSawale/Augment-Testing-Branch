/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'productionplanning.formworktype';

	/**
	 * @ngdoc controller
	 * @name productionplanningFormworktypeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of formwork type entities.
	 **/

	angular.module(moduleName).controller('productionplanningFormworktypeListController', ListController);

	ListController.$inject = ['$scope', 'platformContainerControllerService', 'productionplanningFormworktypeConstantValues'];

	function ListController($scope, platformContainerControllerService, constantValues) {
		platformContainerControllerService.initController($scope, moduleName, constantValues.uuid.container.formworktypeList);
	}

})(angular);
