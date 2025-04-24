/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationModelImportProfileListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of model administration model import profile entities.
	 **/

	angular.module(moduleName).controller('modelAdministrationModelImportProfileListController',
		ModelAdministrationModelImportProfileListController);

	ModelAdministrationModelImportProfileListController.$inject = ['$scope', 'platformContainerControllerService',
		'modelAdministrationModelImportDefaultProfilesService'];

	function ModelAdministrationModelImportProfileListController($scope, platformContainerControllerService,
		modelAdministrationModelImportDefaultProfilesService) {
		platformContainerControllerService.initController($scope, moduleName, 'aa55f4fd2cbd43f69bead3e4a5cd454f');

		modelAdministrationModelImportDefaultProfilesService.addToolBarButton($scope);
	}
})(angular);
