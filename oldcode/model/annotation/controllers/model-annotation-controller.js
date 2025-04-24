/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.annotation';

	angular.module(moduleName).controller('modelAnnotationController', modelAnnotationController);

	modelAnnotationController.$inject = ['$scope', 'platformMainControllerService',
		'modelAnnotationDataService', 'modelAnnotationTranslationService',
		'modelViewerStandardFilterService'];

	function modelAnnotationController($scope, platformMainControllerService,
		modelAnnotationDataService, modelAnnotationTranslationService,
		modelViewerStandardFilterService) {

		$scope.path = globals.appBaseUrl;
		const opt = {search: true, reports: true};
		const mc = {};
		const sidebarReports = platformMainControllerService.registerCompletely($scope, modelAnnotationDataService, mc, modelAnnotationTranslationService, moduleName, opt);

		modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('modelAnnotationModelFilterService');

		$scope.$on('$destroy', function () {
			platformMainControllerService.unregisterCompletely(modelAnnotationDataService, sidebarReports, modelAnnotationTranslationService, opt);
		});
	}
})(angular);
