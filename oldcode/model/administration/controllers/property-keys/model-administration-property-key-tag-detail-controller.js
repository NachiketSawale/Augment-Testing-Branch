/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.administration';

	/**
	 * @ngdoc controller
	 * @name modelAdministrationPropertyKeyTagDetailController
	 * @function
	 *
	 * @description
	 * Controller for the detail view of model administration property key tag entities.
	 **/
	angular.module(moduleName).controller('modelAdministrationPropertyKeyTagDetailController', ModelAdministrationDetailController);

	ModelAdministrationDetailController.$inject = ['$scope', 'platformContainerControllerService',
		'modelAdministrationPropertyKeyTagDataService'];

	function ModelAdministrationDetailController($scope, platformContainerControllerService,
		modelAdministrationPropertyKeyTagDataService) {

		platformContainerControllerService.initController($scope, moduleName, '3630b32c31c7492681c5c79e76af90a9', 'modelAdministrationTranslationService');

		modelAdministrationPropertyKeyTagDataService.addEmptyCategorySelectedOverlay($scope.getUiAddOns());

		$scope.$on('$destroy', function () {
			modelAdministrationPropertyKeyTagDataService.removeEmptyCategorySelectedOverlay($scope.getUiAddOns());
		});
	}

})(angular);
