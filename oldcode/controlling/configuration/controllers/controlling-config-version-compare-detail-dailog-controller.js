/*
 * Copyright(c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	let moduleName = 'controlling.configuration';
	angular.module(moduleName).controller('controllingConfigVersionCompareDetailDialogController',
		['_','$scope', '$translate', '$injector', 'platformGridControllerService', 'platformGridAPI','$timeout', 'basicsLookupdataLookupControllerFactory',
			'controllingConfigVersionCompareDetailDialogUiService','controllingConfigVersionCompareDetailDialogDataService', 'controllingConfigColumnFormulaLookupService',
			'basicsLookupdataLookupFilterService', 'definitionType',
			function (_, $scope, $translate, $injector, platformGridControllerService, platformGridAPI, $timeout, lookupControllerFactory,
				gridUIConfigService,gridDataService, controllingConfigColumnFormulaLookupService,
				basicsLookupdataLookupFilterService, definitionType) {
				$scope.gridId = 'd0d2e59760c3496e8061802041f7b2a9';

				$scope.modalOptions = {
					headerText: $translate.instant('controlling.configuration.versionCompareTitle'),
					closeButtonText: $translate.instant('basics.common.cancel'),
					actionButtonText: $translate.instant('basics.common.ok')
				};

				let headerEntity = $scope.options.entity;
				gridDataService.readonly = headerEntity.IsBaseConfigData;

				$scope.getContainerUUID = function () {
					return $scope.gridId;
				};

				$scope.setTools = function (tools) {
					let bulkTool = _.find(tools.items, {id: 't14'});
					if(bulkTool){
						bulkTool.sort = 7;
						delete bulkTool.permission;
						toolItems.push(bulkTool);
					}

					tools.update = function () {
						tools.version += 1;
					};
				};

				let searchAllToggle = {
					id: 'gridSearchAll',
					sort: 4,
					caption: 'cloud.common.taskBarSearch',
					type: 'check',
					iconClass: 'tlb-icons ico-search-all',
					fn: function () {
						$scope.toggleFilter(this.value);

						if (this.value) {
							searchColumnToggle.value = false;
							$scope.toggleColumnFilter(false, true);
						}
					},
					disabled: function () {
						return $scope.showInfoOverlay;
					}
				};
				let searchColumnToggle = {
					id: 'gridSearchColumn',
					sort: 5,
					caption: 'cloud.common.taskBarColumnFilter',
					type: 'check',
					iconClass: 'tlb-icons ico-search-column',
					fn: function () {
						$scope.toggleColumnFilter(this.value);

						if (this.value) {
							searchAllToggle.value = false;
							$scope.toggleFilter(false, true);
						}
					},
					disabled: function () {
						return $scope.showInfoOverlay;
					}
				};

				let toolItems = [
					{
						id: 'create',
						sort: 0,
						caption: 'cloud.common.taskBarNewRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						fn: function () {
							gridDataService.createItem();
						},
						disabled: function (){
							return gridDataService.readonly;
						}
					},
					{
						id: 'delete',
						sort: 1,
						caption: 'cloud.common.taskBarDeleteRecord',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-delete',
						fn: function () {
							gridDataService.deleteItem();
						},
						disabled: function (){
							return gridDataService.readonly;
						}
					},
					{
						id: 'd2',
						sort: 3,
						type: 'divider'
					},
					searchAllToggle,
					searchColumnToggle,
					{
						id: 't4',
						sort: 6,
						caption: 'cloud.common.print',
						iconClass: 'tlb-icons ico-print-preview',
						type: 'item',
						fn: function () {
							$injector.get('reportingPrintService').printGrid($scope.gridId);
						}
					}
				];

				if (platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.unregister($scope.gridId);
				}

				platformGridControllerService.initListController($scope, gridUIConfigService, gridDataService, null, {
					initCalled: false,
					columns: [],
					type: 'VersionCompares',
					skipPermissionCheck: true,
					grouping: true,
					enableColumnReorder: true,
					enableConfigSave: true,
					enableModuleConfig: true,
				});
				$injector.get('platformContainerUiAddOnService').addManagerAccessor($scope, angular.element('#'+$scope.gridId), angular.noop);

				platformGridAPI.events.unregister($scope.gridId, 'onGroupingChanged', ()=>{});
				platformGridAPI.events.unregister($scope.gridId, 'onHeaderToggled', ()=>{});
				platformGridAPI.events.unregister($scope.gridId, 'onInitialized', ()=>{});

				let gridOptions = {
					gridId: $scope.gridId,
					columns: platformGridAPI.grids.element('id', $scope.gridId).columns,
					idProperty : 'Id',
					lazyInit: true,
					grouping: true,
					enableDraggableGroupBy: true
				};

				lookupControllerFactory.create({grid: true,dialog: true}, $scope, gridOptions);

				$scope.toggleFilter = function (active, clearFilter) {
					platformGridAPI.filters.showSearch($scope.gridId, active, clearFilter);
				};

				$scope.toggleColumnFilter = function (active, clearFilter) {
					platformGridAPI.filters.showColumnSearch($scope.gridId, active, clearFilter);
				};

				$scope.tools.items = _.filter($scope.tools.items, item=>{
					return ['d0','d1','user-sys-template-dd', 'role-template-dd'].indexOf(item.id) < 0;
				});

				$scope.tools.items = toolItems.concat($scope.tools.items)

				$timeout(function () {
					$scope.tools.update();
				});

				$scope.isReady = true;
				gridDataService.setCurrentCompareHeader($scope.$parent.modalOptions.entity);
				controllingConfigColumnFormulaLookupService.getList().then(function (){
					gridDataService.loadData().then(function (){
						$timeout(function (){platformGridAPI.grids.resize($scope.gridId);});
					});
				});

				$scope.hasErrors = function checkForErrors() {
					return  gridDataService.hasAnyError() || $scope.isLoading || gridDataService.readonly;
				};

				$scope.onOK = function () {
					gridDataService.saveEntities();
					$scope.$close({});
				};

				$scope.onCancel = function () {
					$scope.$close({});
				};

				$scope.modalOptions.cancel = function () {
					$scope.$close(false);
				};

				function onChangeGridContent() {
					let selected = platformGridAPI.rows.selection({
						gridId: $scope.gridId
					});
					selected = _.isArray(selected) ? selected[0] : selected;

					_.forEach($scope.tools.items, function (item) {
						if (item.id === 'delete'){
							item.disabled = !selected || gridDataService.readonly;
						}
					});
					$scope.tools.update();
				}

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);

				let lookupFilter = [
					{
						key: 'formula-definition-un-using-list-filter',
						serverSide: false,
						fn: function (item) {
							let list = gridDataService.getList();
							if(!list || !list.length){
								return true;
							}

							list = item.Type === definitionType.COLUMN ? _.filter(list, (i) => !!i.MdcContrColumnPropdefFk) : _.filter(list, (i) => !!i.MdcContrFormulaPropdefFk);

							return item.Type === definitionType.COLUMN ? _.map(list, 'MdcContrColumnPropdefFk').indexOf(item.itemId) === -1 : _.map(list, 'MdcContrFormulaPropdefFk').indexOf(item.itemId) === -1;
						}
					}
				];

				basicsLookupdataLookupFilterService.registerFilter(lookupFilter);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', onChangeGridContent);
					if (platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.grids.unregister($scope.gridId);
					}

					platformGridAPI.events.unregister($scope.gridId, 'onGroupingChanged', ()=>{});
					platformGridAPI.events.unregister($scope.gridId, 'onHeaderToggled', ()=>{});
					platformGridAPI.events.unregister($scope.gridId, 'onInitialized', ()=>{});

					basicsLookupdataLookupFilterService.unregisterFilter(lookupFilter);
				});

			}]);
})(angular);