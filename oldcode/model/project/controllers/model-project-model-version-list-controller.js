/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var moduleName = 'model.project';

	/**
	 * @ngdoc controller
	 * @name modelProjectModelVersionListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of the models
	 **/
	angular.module(moduleName).controller('modelProjectModelVersionListController',
		['$scope', 'platformContainerControllerService', 'modelProjectModelVersionDataService',
			'modelViewerModelDisplaySettingsDialogService', 'modelViewerHoopsSlaveService',
			'modelViewerModelSelectionService', 'modelViewerFixedModuleConfigurationService',
			'platformGridControllerService', 'modelProjectModelCompositeToolsService',
			function ($scope, platformContainerControllerService, modelProjectModelVersionDataService,
			          modelViewerModelDisplaySettingsDialogService, modelViewerHoopsSlaveService,
			          modelViewerModelSelectionService, modelViewerFixedModuleConfigurationService,
			          platformGridControllerService, modelProjectModelCompositeToolsService) {


				platformContainerControllerService.initController($scope, moduleName, 'd5d4776c5ea64701912a9c8b007ec446');
				modelViewerModelSelectionService.setItemSource(modelViewerFixedModuleConfigurationService.getModelSelectionSource());

				var tools = [{
					id: 't1',
					caption: 'model.viewer.modelSettings',
					type: 'item',
					iconClass: 'tlb-icons ico-model-config',
					fn: function () {
						modelViewerModelDisplaySettingsDialogService.showDialog();
					},
					disabled: function () {
						return !modelProjectModelVersionDataService.getSelected();
					}
				},
				{
					id: 'delete',
					caption: 'cloud.common.toolbarDelete',
					iconClass: 'tlb-icons ico-rec-delete',
					type: 'item',
					fn: function () {
						modelProjectModelVersionDataService.deleteCompleteModel();
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

				//modelProjectModelCompositeToolsService.patchTools($scope);
			}
		]);
})(angular);
