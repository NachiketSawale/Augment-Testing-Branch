/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'model.changeset';

	// capitalization in name to suit AngularJS's behavior
	angular.module(moduleName).controller('modelChangesetController', ModelChangesetController);

	ModelChangesetController.$inject = ['$scope', 'platformMainControllerService', 'modelChangeSetDataService',
		'modelChangeSetTranslationService', 'modelViewerModelSelectionService', 'modelViewerStandardFilterService',
		'basicsCommonTemporaryIdStorageService'];

	function ModelChangesetController($scope, platformMainControllerService, modelChangeSetDataService,
		modelChangeSetTranslationService, modelViewerModelSelectionService, modelViewerStandardFilterService,
		basicsCommonTemporaryIdStorageService) {

		modelViewerModelSelectionService.setItemSource('pinnedModel');

		modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('modelChangesetModelFilterService');
		modelViewerStandardFilterService.setModuleSpecificFilterProviderName('modelChangesetProvideModelFiltersService');

		$scope.path = globals.appBaseUrl;
		const opt = {search: true, reports: true};
		const mc = {};
		const sidebarReports = platformMainControllerService.registerCompletely($scope, modelChangeSetDataService, mc, modelChangeSetTranslationService, moduleName, opt);

		const unregisterReportIdsHandler = basicsCommonTemporaryIdStorageService.saveEntityIdsForReporting(modelChangeSetDataService, e => {
			return {
				PKey1: e.ModelFk,
				Id: e.Id
			};
		});

		$scope.$on('$destroy', function () {
			unregisterReportIdsHandler();
			platformMainControllerService.unregisterCompletely(modelChangeSetDataService, sidebarReports, modelChangeSetTranslationService, opt);
		});
	}
})(angular);
