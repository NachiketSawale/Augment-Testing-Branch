/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationPropertyKeyTagListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of model administration property key tag entities.
	 **/
	angular.module(moduleName).controller('modelAdministrationPropertyKeyTagListController', ModelAdministrationListController);

	ModelAdministrationListController.$inject = ['$scope', 'platformContainerControllerService',
		'modelAdministrationPropertyKeyTagDataService'];

	function ModelAdministrationListController($scope, platformContainerControllerService,
		modelAdministrationPropertyKeyTagDataService) {

		platformContainerControllerService.initController($scope, moduleName, '7cfd83a5ad6b4a988250819559936199');

		modelAdministrationPropertyKeyTagDataService.addEmptyCategorySelectedOverlay($scope.getUiAddOns());

		$scope.$on('$destroy', function () {
			modelAdministrationPropertyKeyTagDataService.removeEmptyCategorySelectedOverlay($scope.getUiAddOns());
		});
	}
})(angular);
