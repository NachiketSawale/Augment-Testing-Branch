/**
 * Created by zov on 15/05/2019.
 */
(function () {
	'use strict';
	/* global angular, _ */

	var moduleName = 'productionplanning.common';
	angular.module(moduleName).controller('ppsCommonProjectLocationSideloadListController', [
		'$scope', '$injector',
		'ppsCommonProjectLocationSideloadFilterDataServiceFactory',
		'productionplanningEngineeringTaskClipboardService',
		'platformGridControllerService', 'projectLocationStandardConfigurationService',
		'ppsCommonProjectLocationValidationServiceFactory', '$translate',
		'platformGridAPI',
		'platformPermissionService',
		'platformRuntimeDataService',
		function (
			$scope, $injector,
			ppsCommonProjectLocationSideloadFilterDataServiceFactory,
			ppsEngineeringTaskClipboardService,
			platformGridControllerService, uiStandardService,
			validationServiceFactory, $translate,
			platformGridAPI,
			platformPermissionService,
			platformRuntimeDataService) {

			var mainServiceName = $scope.getContentValue('mainService');
			var isEditable = $scope.getContentValue('editable');
			var filterType = $scope.getContentValue('filterType');
			var uuid = $scope.getContentValue('uuid');
			var mainService = $injector.get(mainServiceName);
			var dataService = ppsCommonProjectLocationSideloadFilterDataServiceFactory.getPrjLocationFilterService(mainService, isEditable, filterType, uuid);

			var gridConfig = {
				initCalled: false,
				columns: [], parentProp: 'LocationParentFk',
				childProp: 'Locations',
				type: 'projectLocation-leadingStructure',
				dragDropService: ppsEngineeringTaskClipboardService,
				marker: {
					filterService: dataService,
					filterId: mainServiceName + '_ProjectLocation',
					dataService: dataService,
					serviceName: mainServiceName,
					serviceMethod: 'getPrjLocationList',
					multiSelect: false
				}
			};
			var validationService = validationServiceFactory.create(dataService);
			platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);

			$scope.overlayInfo = $translate.instant('productionplanning.common.filterPrjLocation');

			function reloadData() {
				platformGridAPI.grids.commitEdit(uuid);
				dataService.update();
				var projectId = mainService.getSelectedProjectId();
				if (projectId > 0) {
					$scope.showInfoOverlay = false;
					if (projectId !== dataService.lastProjectFilterFk) {
						dataService.load();
					}
				} else {
					$scope.showInfoOverlay = true;
					// dataService.setFilter([]);
				}
			}

			var toolItem = _.find($scope.tools.items, {id: 't13'});  // item filter button
			if (toolItem) {
				toolItem.caption = 'productionplanning.common.toolbarMainEntityFilter';
			}

			$scope.addTools([
				{
					id: 't100',
					caption: 'project.location.downgradeLocation',
					type: 'item',
					iconClass: 'tlb-icons ico-demote',
					fn: function () {
						dataService.downgradeLocation(uuid);
					}
				},
				{
					id: 't101',
					caption: 'project.location.upgradeLocation',
					type: 'item',
					iconClass: 'tlb-icons ico-promote',
					fn: function () {
						dataService.upgradeLocation(uuid);
					}
				}
			]);

			// handle createButton, createChildButton, deleteButton, downgradeLocation and upgradeLocation depending on permissions of /Project/Containers/Locations
			let permissionGUID = '42ff27d7f0ea40eaba389d669be3a1df';
			platformPermissionService.loadPermissions(permissionGUID, true)
				.then(function () {
					if (!platformPermissionService.hasCreate(permissionGUID, true)) {
						_.remove($scope.tools.items, {id: 'create'});
						_.remove($scope.tools.items, {id: 'createChild'});
					}
					if (!platformPermissionService.hasDelete(permissionGUID, true)) {
						_.remove($scope.tools.items, {id: 'delete'});
					}
					if (!platformPermissionService.hasWrite(permissionGUID, true)) {
						_.remove($scope.tools.items, {id: 't100'});
						_.remove($scope.tools.items, {id: 't101'});
						dataService.readOnly = true;
					}
				});

			reloadData();

			function setCurseOnDescription(){
				var selected = dataService.getSelected();
				if (selected && selected.Version === 0) {
					var grid = platformGridAPI.grids.element('id', uuid);
					var currentCell = grid.instance.getActiveCell();
					var cells = grid.instance.getColumns();
					var index = _.indexOf(cells, _.find(cells, {field: 'DescriptionInfo'}));
					if (currentCell && index > -1) {
						grid.instance.setCellFocus(currentCell.row, index, true);
					}
				}
			}

			dataService.registerSelectionChanged(setCurseOnDescription);

			dataService.registerEntityCreated(setCurseOnDescription);

			mainService.registerSelectionChanged(reloadData);
			mainService.registerRefreshRequested(dataService.refresh);
			$scope.$on('$destroy', function () {
				platformGridAPI.grids.commitEdit(uuid);
				dataService.update();
				mainService.unregisterRefreshRequested(dataService.refresh);
				mainService.unregisterSelectionChanged(reloadData);
				dataService.registerSelectionChanged(setCurseOnDescription);
			});
		}
	]);
})();
