/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationModelImportProfileDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of model administration model import profile entities.
	 **/
	angular.module(moduleName).controller('modelAdministrationModelImportProfileListController',
		ModelAdministrationModelImportProfileListController);

	ModelAdministrationModelImportProfileListController.$inject = ['$scope', 'platformContainerControllerService'];

	function ModelAdministrationModelImportProfileListController($scope, platformContainerControllerService) {
		platformContainerControllerService.initController($scope, moduleName, '225eae28ec104a3fa0c8b6210948fbf2', 'modelAdministrationTranslationService');
	}

})(angular);