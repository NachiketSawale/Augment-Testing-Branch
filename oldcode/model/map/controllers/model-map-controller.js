/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.map';

	angular.module(moduleName).controller('modelMapController', ModelMapController);

	ModelMapController.$inject = ['$scope', 'platformMainControllerService', 'modelMapDataService',
		'modelMapTranslationService', 'projectMainFixedModuleConfigurationService',
		'modelViewerFixedModuleConfigurationService'];

	function ModelMapController($scope, platformMainControllerService, modelMapDataService,
		modelMapTranslationService, projectMainFixedModuleConfigurationService,
		modelViewerFixedModuleConfigurationService) {

		$scope.path = globals.appBaseUrl;
		const opt = {search: true, reports: true};
		const mc = {};
		const sidebarReports = platformMainControllerService.registerCompletely($scope, modelMapDataService, mc, modelMapTranslationService, moduleName, opt);
		projectMainFixedModuleConfigurationService.updateProjectSelectionSource();
		modelViewerFixedModuleConfigurationService.updateModelSelectionSource();
		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformMainControllerService.unregisterCompletely(modelMapDataService, sidebarReports, modelMapTranslationService, opt);
		});
	}
})(angular);
