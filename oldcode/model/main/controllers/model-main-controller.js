/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.main';

	angular.module(moduleName).controller('modelMainController', ModelMainController);

	ModelMainController.$inject = ['$scope', 'platformMainControllerService',
		'platformPermissionService', 'modelMainObjectDataService', 'modelMainTranslationService',
		'modelProjectModelReadonlyDataService', 'modelMainSidebarWizardService',
		'documentsProjectDocumentDataService', 'modelViewerStandardFilterService', '$translate',
		'basicsWorkflowSidebarRegisterService', '$injector', '_'];

	function ModelMainController($scope, platformMainControllerService,
		platformPermissionService, modelMainObjectDataService, modelMainTranslationService,
		modelProjectModelReadonlyDataService, modelMainSidebarWizardService,
		documentsProjectDocumentDataService, modelViewerStandardFilterService, $translate,
		basicsWorkflowSidebarRegisterService, $injector, _) {

		$scope.path = globals.appBaseUrl;
		const opt = {search: true, reports: true, auditTrail: 'b0dbd879bac54be984caba9eb158033e'};
		const mc = {};
		const sidebarReports = platformMainControllerService.registerCompletely($scope, modelMainObjectDataService, mc, modelMainTranslationService, moduleName, opt);
		modelMainSidebarWizardService.activate();
		documentsProjectDocumentDataService.register({
			moduleName: moduleName,
			title: $translate.instant('model.main.modelObjectListTitle'),
			parentService: modelMainObjectDataService,
			columnConfig: [
				{documentField: 'MdlObjectFk', dataField: 'Id', readOnly: false},
				{documentField: 'ModelFk', dataField: 'ModelFk', readOnly: false}
			],
			otherFilter: [{documentField: 'MdlModelFk', dataField: 'ModelFk'}]
		});

		modelViewerStandardFilterService.getFilterById('mainEntity').setUpdateFuncProviderName('modelMainModelFilterService');

		// sidebar | information
		/* const info = {
			name: cloudDesktopSidebarService.getSidebarIds().info,
			title: 'info',
			type: 'template',
			templateUrl: globals.appBaseUrl + 'model.main/templates/sidebar-info.html'
		};
		cloudDesktopSidebarService.registerSidebarContainer(info, true); */

		basicsWorkflowSidebarRegisterService.registerEntityForModule('78d850f228d74ca582df9866ac5a2cf3', 'model.main', false, function getSelectedModelId() {
			const modelMainObjectDataService = $injector.get('modelMainObjectDataService');
			const selObj = modelMainObjectDataService.getSelected();
			if (selObj) {
				return selObj.ModelFk;
			}

			const modelViewerModelSelectionService = $injector.get('modelViewerModelSelectionService');
			return modelViewerModelSelectionService.getSelectedModelId();
		}, function getModelIdList() {
			const modelMainObjectDataService = $injector.get('modelMainObjectDataService');
			const items = modelMainObjectDataService.getList();
			if (_.isArray(items)) {
				return _.uniq(_.map(items, function (item) {
					return item.ModelFk;
				}));
			}

			const modelViewerModelSelectionService = $injector.get('modelViewerModelSelectionService');
			const selModelId = modelViewerModelSelectionService.getSelectedModelId();
			if (_.isNumber(selModelId)) {
				return [selModelId];
			}

			return [];
		}, angular.noop, angular.noop);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			platformMainControllerService.unregisterCompletely(modelMainObjectDataService, sidebarReports, modelMainTranslationService, opt);
			// cloudDesktopSidebarService.unRegisterSidebarContainer(info.name, true);
		});

		modelProjectModelReadonlyDataService.loadAllModels();
	}
})(angular);
