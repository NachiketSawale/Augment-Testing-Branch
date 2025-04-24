/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationModelImportPropertyKeyRuleListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of model administration model import property key rule entities.
	 **/

	angular.module(moduleName).controller('modelAdministrationModelImportPropertyKeyRuleListController',
		ModelAdministrationModelImportPropertyKeyRuleListController);

	ModelAdministrationModelImportPropertyKeyRuleListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelAdministrationModelImportPropertyKeyRuleListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, 'd0bad362f2c34cec9a1bf934d064ff89');
	}
})(angular);