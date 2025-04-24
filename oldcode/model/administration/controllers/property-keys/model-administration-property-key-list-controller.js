/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationPropertyKeyListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of model administration property key entities.
	 **/
	angular.module(moduleName).controller('modelAdministrationPropertyKeyListController', ModelAdministrationListController);

	ModelAdministrationListController.$inject = ['$scope', 'platformContainerControllerService',
		'modelAdministrationPropertyKeyCreationService', 'modelAdministrationPropertyKeyRemovalService'];

	function ModelAdministrationListController($scope, platformContainerControllerService,
		modelAdministrationPropertyKeyCreationService,
		modelAdministrationPropertyKeyRemovalService) {

		platformContainerControllerService.initController($scope, moduleName, 'f3dd6a81c5e14fddbe2f1b0b8cf05340');

		modelAdministrationPropertyKeyCreationService.patchCreateButton($scope);
		modelAdministrationPropertyKeyRemovalService.patchRemoveButton($scope);
	}
})(angular);
