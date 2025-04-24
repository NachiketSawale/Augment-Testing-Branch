/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.change';

	angular.module(moduleName).controller('modelChangeController', modelChangeController);

	modelChangeController.$inject = ['$scope', 'platformMainControllerService', 'modelChangeDataService',
		'modelChangeTranslationService', 'modelViewerStandardFilterService',
		'basicsCommonTemporaryIdStorageService'];

	function modelChangeController($scope, platformMainControllerService, modelChangeDataService,
		modelChangeTranslationService, modelViewerStandardFilterService,
		basicsCommonTemporaryIdStorageService) {

		$scope.path = globals.appBaseUrl;
		const opt = {search: true, reports: true};
		const mc = {};
		const sidebarReports = platformMainControllerService.registerCompletely($scope, modelChangeDataService, mc, modelChangeTranslationService, moduleName, opt);

		modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('modelChangeModelFilterService');

		const unregisterReportIdsHandler = basicsCommonTemporaryIdStorageService.saveEntityIdsForReporting(modelChangeDataService, e => {
			return {
				PKey2: e.ModelFk,
				PKey1: e.ChangeSetFk,
				Id: e.Id
			};
		});

		$scope.$on('$destroy', function () {
			unregisterReportIdsHandler();
			platformMainControllerService.unregisterCompletely(modelChangeDataService, sidebarReports, modelChangeTranslationService, opt);
		});
	}
})(angular);
