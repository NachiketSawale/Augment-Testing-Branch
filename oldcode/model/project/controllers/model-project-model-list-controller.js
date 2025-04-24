/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.project';

	/**
	 * @ngdoc controller
	 * @name modelProjectModelListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the models
	 **/
	angular.module(moduleName).controller('modelProjectModelListController',
		modelProjectModelListController);

	modelProjectModelListController.$inject = ['$scope', 'platformContainerControllerService',
		'modelProjectModelDataService', 'modelViewerModelDisplaySettingsDialogService',
		'modelViewerHoopsSlaveService', 'modelViewerModelSelectionService',
		'modelViewerFixedModuleConfigurationService', 'platformGridControllerService',
		'modelProjectModelCompositeToolsService',
		'modelProjectProjectSettingsDialogService', 'projectMainService'];

	function modelProjectModelListController($scope, platformContainerControllerService,
		modelProjectModelDataService, modelViewerModelDisplaySettingsDialogService,
		modelViewerHoopsSlaveService, modelViewerModelSelectionService,
		modelViewerFixedModuleConfigurationService, platformGridControllerService,
		modelProjectModelCompositeToolsService,
		modelProjectProjectSettingsDialogService, projectMainService) {

		platformContainerControllerService.initController($scope, moduleName, '77dd0994f5f544ddaf048c1a5f17c5fe');
		modelViewerModelSelectionService.setItemSource(modelViewerFixedModuleConfigurationService.getModelSelectionSource());

		const tools = [{
			id: 't1',
			caption: 'model.viewer.modelSettings',
			type: 'item',
			iconClass: 'tlb-icons ico-model-config',
			fn: function () {
				modelViewerModelDisplaySettingsDialogService.showDialog();
			},
			disabled: function () {
				return !modelProjectModelDataService.getSelected();
			}
		}, {
			id: 'projectSettings',
			caption: 'model.project.projectsettings',
			type: 'item',
			iconClass: 'tlb-icons ico-administration',
			fn: function () {
				modelProjectProjectSettingsDialogService.showDialog();
			},
			disabled: function () {
				const selected = projectMainService.getSelected();
				return !selected;
			}
		}, {
			id: 'delete',
			caption: 'cloud.common.toolbarDelete',
			iconClass: 'tlb-icons ico-rec-delete',
			type: 'item',
			fn: function () {
				modelProjectModelDataService.deleteCompleteModel();
			}
		}];
		if (modelViewerHoopsSlaveService.isSlaveEnabled()) {
			tools.push({
				id: 'extViewer',
				caption: 'model.viewer.unfilteredViewerWindow',
				type: 'item',
				iconClass: 'tlb-icons ico-view-extwindow',
				fn: function () {
					modelViewerHoopsSlaveService.showViewerWindow('disabled');
				}
			});
		}

		platformGridControllerService.addTools(tools);

		modelProjectModelCompositeToolsService.patchTools($scope);
	}
})(angular);
