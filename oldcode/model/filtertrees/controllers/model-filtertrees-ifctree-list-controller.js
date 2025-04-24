/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'model.filtertrees';

	/**
	 * @ngdoc controller
	 * @name modelFiltertreesIFCTreeListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of projects
	 **/
	angular.module(moduleName).controller('modelFiltertreesIFCTreeListController', modelFiltertreesIFCTreeListController);

	modelFiltertreesIFCTreeListController.$inject = ['$scope', 'platformContainerControllerService', 'platformGridControllerService', 'modelFiltertreesIFCTreeDataService', 'platformModalService', '$translate', 'platformTranslateService', 'platformModalFormConfigService', 'basicsLookupdataConfigGenerator'];

	function modelFiltertreesIFCTreeListController($scope, platformContainerControllerService, platformGridControllerService, modelFiltertreesIFCTreeDataService, platformModalService, $translate, platformTranslateService, platformModalFormConfigService, basicsLookupdataConfigGenerator) {

		platformContainerControllerService.initController($scope, moduleName, '722a80284d6843a19d4ec83f5183cbaa');

		var toolbarItems = [
			{
				id: 'defaultx01',
				caption: 'Refresh',
				type: 'item',
				cssClass: 'tlb-icons ico-refresh',
				fn: function () {
					modelFiltertreesIFCTreeDataService.callRefresh();
				}
			}
		];
		modelFiltertreesIFCTreeDataService.viewTreeTemplate = function () {
			//var selected = modelFiltertreesIFCTreeDataService.activeTemplateId;
			var modalDialogConfig = {
				title: $translate.instant('model.filtertrees.treeTemplate'),
				dataItem: {
					Id: (modelFiltertreesIFCTreeDataService.activeTemplateId ?? 0) // Preselect the current template ID or default to 0
				},
				formConfiguration: {
					fid: 'model.filtertrees.treeTemplateDialog',
					version: '0.1.0',
					showGrouping: false,
					groups: [{
						gid: 'baseGroup',
						attributes: []
					}],
					rows: [
						basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'modelFilterTreeLookupDataService',
							cacheEnable: true,
							additionalColumns: false,
							showClearButton: false
						},
							{
								required: true,
								gid: 'baseGroup',
								rid: 'Id',
								label: 'Tree Template',
								label$tr$: 'model.filtertrees.selectTreeTemplate',
								type: 'lookup',
								model: 'Id',
								sortOrder: 1
							})
					]
				},
				handleOK: function handleOK(result) {
					var templateId = result.data.Id;
					modelFiltertreesIFCTreeDataService.switchTreeTemplate(templateId);
					
				},
				handleCancel: function handleCancel() {

				}
			};

			platformTranslateService.translateFormConfig(modalDialogConfig.formConfiguration);
			platformModalFormConfigService.showDialog(modalDialogConfig);
		}
		var toolbarItemsTreeTemplate = [
			{
				id: 'viewtreetemplate',
				caption: $translate.instant('model.filtertrees.openTreeTemplate'),
				type: 'item',
				iconClass: 'tlb-icons ico-container-config',
				fn: function () {
					modelFiltertreesIFCTreeDataService.viewTreeTemplate($scope, modelFiltertreesIFCTreeDataService, true);
				},
				disabled: function () {
					return false;
				}
			}
		];

		platformGridControllerService.addTools(toolbarItems);
		platformGridControllerService.addTools(toolbarItemsTreeTemplate);
		$scope.tools.update();
	}
})();