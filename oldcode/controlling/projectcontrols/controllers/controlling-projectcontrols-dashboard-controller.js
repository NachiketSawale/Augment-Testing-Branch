(function (angular) {
	'use strict';

	let moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).controller('controllingProjectcontrolsDashboardController', structureController);

	structureController.$inject = ['$rootScope','$injector','$scope', '$http', '$translate', '_', '$timeout', 'moment', 'platformGridAPI', 'reportingPrintService', 'platformGridControllerService',
		'platformTranslateService', 'controllingProjectcontrolsDashboardStructureService', 'controllingProjectControlsUIConfigurationService', 'projectControlsGroupingType', 'controllingProjectcontrolsDashboardService',
	'controllingProjectcontrolsDashboardValidationService', 'projectControlsColumnType'];

	function structureController($rootScope,$injector, $scope, $http, $translate, _, $timeout, moment, platformGridAPI, reportingPrintService, platformGridControllerService,platformTranslateService,
	                             dashboardStructureService, controllingProjectControlsUIConfigurationService, projectControlsGroupingType, dashboardDataService, validationService, projectControlsColumnType) {
		$scope.config = controllingProjectControlsUIConfigurationService.getStandardConfigForListView();
		$scope.scheme = controllingProjectControlsUIConfigurationService.getDtoScheme();
		$scope.groupingColumns = angular.copy(projectControlsGroupingType);
		
		let columnRenames = {
			'sv': 'SV',
			'cv': 'CV',
			'spi': 'SPI',
			'cpi': 'CPI'
		};

		if (_.isArray($scope.config.columns) && $scope.config.columns.length > 0) {
			_.forEach($scope.config.columns, function (column) {
				column.name$tr$ = null;
				column.name = columnRenames[column.id] || column.name;
			});
		}

		let myGridConfig = {
			initCalled: false,
			idProperty: 'Id',
			parentProp: 'ParentFk',
			childProp: 'Children',
			options: {
				tree: true,
				treePrintable: true,
				showDescription: false
			},
			passThrough: {
				treePrintable: true
			},
			columns: []
		};

		platformGridControllerService.initListController($scope, controllingProjectControlsUIConfigurationService, dashboardDataService, validationService, myGridConfig);

		dashboardDataService.setGridId($scope.gridId);

		let sb = $scope.getUiAddOns().getStatusBar();

		sb.showFields([{
			id: 'historyVersion',
			align: 'right',
			type: 'dropdown-btn',
			value: $translate.instant('controlling.projectcontrols.containerTitleControllingVersion')
		},
		{
			id: 'period',
			align: 'right',
			type: 'dropdown-btn',
			value: $translate.instant('controlling.projectcontrols.reportPeriod')
		}]);

		sb.setVisible(true);

		function updateVersionField(selectedVersion) {
			let historyVersionItems = _.map(dashboardDataService.getVersions(), function (item) {
				return {
					id: item.ribPrjHistroyKey,
					caption: item.value,
					type: 'item',
					fn: function (e, args) {
						dashboardDataService.setSelectVersion(args);
						updateVersionFieldInternal('Version ' + args.caption);
						onHistoryVersionChanged();
					}
				};
			});

			function updateVersionFieldInternal(caption) {
				sb.updateFields([{
					id: 'historyVersion',
					align: 'right',
					type: 'dropdown-btn',
					value: caption,
					list: {
						items: historyVersionItems
					}
				}]);
			}

			updateVersionFieldInternal(selectedVersion ? $translate.instant('controlling.projectcontrols.version') + ' ' + selectedVersion : $translate.instant('controlling.projectcontrols.containerTitleControllingVersion'));
		}

		function updatePeriodField(selectedPeriod) {
			let periodItems = _.map(dashboardDataService.getPeriods(), function (item) {
				return {
					id: item.value,
					caption: item.value,
					type: 'item',
					description:item.description,
					fn: function (e, args) {
						dashboardDataService.setSelectPeriod(args);
						updatePeriodFieldInternal('Report Period: ' + args.caption);
						dashboardDataService.load();
						if ($scope.tools) {
							$scope.tools.update();
						}
					}
				};
			});

			function updatePeriodFieldInternal(caption) {
				sb.updateFields([{
					id: 'period',
					align: 'right',
					type: 'dropdown-btn',
					value: caption,
					list: {
						items: periodItems
					}
				}]);
			}
			let reportPeriod = $translate.instant('controlling.projectcontrols.reportPeriod');
			updatePeriodFieldInternal(selectedPeriod ? reportPeriod + ': ' + selectedPeriod : reportPeriod);
		}

		// Options for the generic structure container.
		$scope.options = {
			columns: $scope.config.columns,
			marker: {
				multiSelect: dashboardStructureService.getMarkerState()
			},
			isGenericGroup: dashboardStructureService.isGenericGroup,
			isAutoRefresh: dashboardStructureService.isAutoRefresh()
		};

		// Array containing the displayed items in the generic structure container.
		$scope.containerItems = dashboardDataService.getGroupItems();

		// toolbar definition
		$scope.setTools({
			showImages: true,
			showTitles: true,
			cssClass: 'tools',
			version: 0,
			items: [
				{
					id: 't111',
					sort: 112,
					caption: 'cloud.common.gridlayout',
					iconClass: 'tlb-icons ico-settings',
					type: 'item',
					fn: function () {
						platformGridAPI.configuration.openConfigDialog($scope.getContainerUUID());
					},
					disabled: function () {
						return $scope.showInfoOverlay;
					}
				},
				{
					id: 't109',
					sort: 111,
					caption: 'cloud.common.print',
					iconClass: 'tlb-icons ico-print-preview',
					type: 'item',
					fn: function () {
						reportingPrintService.printGrid($scope.getContainerUUID());
					},
					disabled: function () {
						return $scope.showInfoOverlay;
					}
				},
				{
					id: 'd1',
					sort: 55,
					type: 'divider'
				},
				{
					id: 't7',
					sort: 60,
					caption: 'cloud.common.toolbarCollapse',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-collapse',
					fn: function collapseSelected() {
						platformGridAPI.rows.collapseNextNode($scope.getContainerUUID());
					}
				},
				{
					id: 't8',
					sort: 70,
					caption: 'cloud.common.toolbarExpand',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-expand',
					fn: function expandSelected() {
						platformGridAPI.rows.expandNextNode($scope.getContainerUUID());
					}
				},
				{
					id: 't9',
					sort: 80,
					caption: 'cloud.common.toolbarCollapseAll',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-collapse-all',
					fn: function collapseAll() {
						platformGridAPI.rows.collapseAllSubNodes($scope.getContainerUUID());
					}
				},
				{
					id: 't10',
					sort: 90,
					caption: 'cloud.common.toolbarExpandAll',
					type: 'item',
					iconClass: 'tlb-icons ico-tree-expand-all',
					fn: function expandAll() {
						platformGridAPI.rows.expandAllSubNodes($scope.getContainerUUID());
					}
				},
				{
					id: 'd2',
					sort: 100,
					type: 'divider'
				},
				{
					id: 't11',
					sort: 200,
					caption: 'cloud.common.toolbarRefresh',
					type: 'item',
					iconClass: 'tlb-icons ico-refresh',
					disabled: function () {
						if (dashboardDataService.isValidated()) {
							return true;
						}
						return !dashboardDataService.getGroupingstate().length;
					},
					fn: function refresh() {
						dashboardDataService.load();
					}
				},
				{
					id: 't12',
					sort: 200,
					caption: 'cloud.common.showEmptyData',
					type: 'check',
					value: dashboardDataService.showEmptyData(),
					iconClass: 'tlb-icons ico-empty-line-hide-show',
					disabled: function () {
						return false;
					},
					fn: function refresh() {
						dashboardDataService.toggleShowEmptyData();
					}
				}
			],
			update: function () {
				++$scope.tools.version;
			}
		});

		$scope.toggleFilter = function (active) {
			platformGridAPI.filters.showSearch($scope.gridId, active);
		};

		/******************************************************************************************
		 *  Lifecycle Hooks for generic structure container.
		 ******************************************************************************************/

		$scope.onFilterChanged = function (filterItems) {
			if (filterItems.length) {
				// Filteritems set in service.
				dashboardStructureService.filteredItems(filterItems);
				dashboardStructureService.enableFilter(true);
				$rootScope.$emit('filterIsActive', true);
				if (filterItems.length > 1) {
					_.find($scope.tools.items, {id: 't12'}).value = true;
				}
			} else {
				$rootScope.$emit('filterIsActive', false);
				dashboardStructureService.enableFilter(false);
			}

			$scope.tools.update();
		};

		$scope.onSelectionChanged = function (/* evt, args */) {
			// Handle selection changes in grid here.
			let selected = _.filter(platformGridAPI.rows.getRows($scope.gridData.state), {'IsMarked': true});

			if (selected) {
				dashboardDataService.selectedItems(selected);
			}
		};

		$scope.onItemsProcessed = function (data) {
			if (data && data.length) {
				dashboardDataService.setGroupItems(data);
				dashboardStructureService.processItems(data, dashboardDataService.getGroupingstate());
				dashboardStructureService.postProcessColumns($scope.getContainerUUID(), 'visible');
				platformGridAPI.grids.refresh($scope.getContainerUUID());
				platformGridAPI.grids.invalidate($scope.getContainerUUID());

				if (dashboardStructureService.filteredItems().length > 0) {
					dashboardStructureService.enableFilter(dashboardStructureService.isFilterEnabled());
					$rootScope.$emit('filterIsActive', dashboardStructureService.isFilterEnabled());
				} else {
					dashboardStructureService.enableFilter(false);
					$rootScope.$emit('filterIsActive', false);
				}
			}
		};

		$scope.onGroupStateChanged = function (cid, state) {
			// Add logic to be executed when the group state changes. In this case level to be displayed.
			let item = _.find(dashboardDataService.getGroupingstate(), {id: cid});
			item.sortDesc = 0;
			item.selectToday = 0;
			item.strictTillLevel = 0;
			if(item && item.id === 'Package' && item.metadata){
				item.metadata.showBP = 0;
				item.metadata.showPackageDesc = 0;
			}

			if (item) {
				_.forOwn(state, function (value, key) {
					if (value.state === 'checked') {
						switch (key) {
							case 'allLvls':
								item.levels = 0;
								item.depth = item.metadata && item.metadata.maxLevels || 1;
								break;

							case 'till_1':
								item.levels = item.depth = 1;
								break;

							case 'till_2':
								item.levels = item.depth = 2;
								break;

							case 'till_3':
								item.levels = item.depth = 3;
								break;

							case 'till_4':
								item.levels = item.depth = 4;
								break;

							case 'till_5':
								item.levels = item.depth = 5;
								break;
							case 'date':
								item.dateoption = 'Date';
								break;
							case 'brkdwn':
								item.dateoption = [];
								_.forOwn(value, function (val, key) {
									if (val.state === 'checked') {
										switch (key) {
											case 'year':
												item.dateoption.push('Year');
												break;
											case 'month':
												item.dateoption.push('Month');
												break;
											case 'calwk':
												item.dateoption.push('CalenderWeek');
												break;
											case 'wkday':
												item.dateoption.push('WeekDay');
												break;
											case'day': {
												let dayOption = 'Day';
												switch (val.selected) {
													case 'dayYear':
														dayOption = 'DayYear';
														break;
													default:
														dayOption = 'Day';
														break;
												}
												item.dateoption.push(dayOption);
												break;
											}
										}
									}
								});
								break;
							case 'sortDesc':
								item.sortDesc = 1;
								break;
							case 'selectToday':
								item.selectToday = 1;
								break;
							case 'strictTillLevel':
								item.strictTillLevel = 1;
								break;
							case 'showBP':
								if(item && item.metadata){
									item.metadata.showBP = 2;
								}
								break;
							case 'showPackageDesc':
								if(item && item.metadata){
									item.metadata.showPackageDesc = 1;
								}
								break;
						}
					}
				});

				if (state && state.grpColor) {
					item.colorOptions = {color: state.grpColor.color, enabled: state.grpColor.state === 'checked'};
				}

				if (item.metadata && item.metadata.maxLevels < item.depth) {
					item.depth = item.metadata.maxLevels;
				}
			}
		};

		$scope.onGroupingChanged = function (cid, type) {
			// Todo: Add logic to be executed when grouping columns change: This is called when groups are added and removed.
			switch (type) {
				case 'ADDED': {
					let column = _.find($scope.groupingColumns, {id: cid});
					if (column) {
						dashboardDataService.addGroupingItem(cid, column);
					}
					break;
				}
				case 'REMOVED': {
					dashboardDataService.removeGroupingItem(cid);

					if (!dashboardDataService.getGroupingstate().length) {
						$scope.containerItems = [];
						// platformGenericStructureService.clearFilteredItems(); // rei@4.10.18, make sure filter items are cleared...
					}
					break;
				}
			}

			dashboardStructureService.clearFilteredItems();
			dashboardDataService.clearSelectedItems();
			$scope.tools.update();
		};

		function onHistoryVersionChanged() {
			dashboardDataService.loadPeriods(function (historyVersion) {
				updatePeriodField(historyVersion && historyVersion.period ? historyVersion.period : null);
				dashboardDataService.load();
			});
		}

		function onGroupConfigChanged(prjClassifications) {
			getGroupingColumnsTranlation(projectControlsGroupingType);
			let groupingColumns = angular.copy(projectControlsGroupingType);
			for (let i = 1; i < 5; i++) {
				let prjClassification = prjClassifications ? prjClassifications[i] : null;
				if(prjClassification){
					let groupingColumn = _.find(groupingColumns, {id: 'CostGroup' + i});
					if(groupingColumn){
						groupingColumn.name = $translate.instant('controlling.projectcontrols.costGroup' + i) + '-' + prjClassification.ClasCatologId;
					}
				}
			}

			$timeout(function () {
				$scope.groupingColumns = groupingColumns;
			}, 0);
		}

		function getGroupingColumnsTranlation(groupingColumns){
			if(groupingColumns){
				_.forEach(groupingColumns, (item) => {
					item.name = $translate.instant(item.name$tr$);
				});
			}
		}

		getGroupingColumnsTranlation($scope.groupingColumns);
		function onProjectChanged(historyVersion) {
			if (historyVersion) {
				updateVersionField(historyVersion && historyVersion.ribHistoryId > 0 ? historyVersion.ribHistoryId : null);
				updatePeriodField(historyVersion && historyVersion.period ? historyVersion.period : null);
			}
		}


		dashboardDataService.forceLoadService();

		onProjectChanged(dashboardDataService.getHistoryVersions());

		dashboardDataService.registerHistoryVersionChanged(onProjectChanged);

		dashboardDataService.registerGroupingConfigChanged(onGroupConfigChanged);

		function onHistoryVersionListUpdated(){
			let historyVersion = dashboardDataService.getHistoryVersions();
			if(historyVersion){
				updateVersionField(historyVersion && historyVersion.ribHistoryId > 0 ? historyVersion.ribHistoryId : null);
			}
		}

		dashboardDataService.registerHistoryVersionListUpdated(onHistoryVersionListUpdated);

		function cellChangeCallBack(e,arg){
			let config = arg.cell ? arg.grid.getColumns()[arg.cell] : null;
			let field = null, basContrColumnType = -1;
			if(config){
				field = config.field;
				basContrColumnType = config.basContrColumnType;
			}
			let currentItem = arg.item;
			if(!field || !currentItem || !currentItem.EditableInfo){
				return;
			}

			let items = dashboardDataService.getList();

			_.forEach(items, function(item){
				if(item.EditableInfo && currentItem.EditableInfo.ControllingUnitFk === item.EditableInfo.ControllingUnitFk && currentItem.EditableInfo.ControllingUnitCostCodeFk === item.EditableInfo.ControllingUnitCostCodeFk){
					if(basContrColumnType === projectControlsColumnType.SAC){
						let inField = field + '_IN_RP';
						let toField = field + '_TO_RP';
						let detailField = field + 'Detail';
						item[toField] = (item[toField] * 100 - item[inField] * 100 + item[detailField] * 100) / 100;
						item[inField] = item[detailField];
						dashboardDataService.markSACItemAsModified(item, null, field, config);
					}
					else{
						if(basContrColumnType === projectControlsColumnType.WCF || basContrColumnType === projectControlsColumnType.BCF || basContrColumnType === projectControlsColumnType.CUSTOM_FACTOR){
							item[field] = currentItem[field];
							item[field + '_IS_MODIFIED'] = true;
						}

						dashboardDataService.markItemAsModified(item);
					}
				}
			});

		}
		platformGridAPI.events.register($scope.gridId, 'onCellChange', cellChangeCallBack);

		function onGridRenderCompleted(){
			platformGridAPI.events.unregister($scope.gridId, 'onRenderCompleted', onGridRenderCompleted);
			if(_.isFunction(dashboardDataService.forceReloadAfterFirstInit)){
				dashboardDataService.forceReloadAfterFirstInit();
				dashboardDataService.forceReloadAfterFirstInit = null;
			}
		}
		platformGridAPI.events.register($scope.gridId, 'onRenderCompleted', onGridRenderCompleted);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			dashboardDataService.unregisterHistoryVersionChanged(onProjectChanged);

			dashboardDataService.unregisterGroupingConfigChanged(onGroupConfigChanged);

			dashboardDataService.unregisterHistoryVersionListUpdated(onHistoryVersionListUpdated);

			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', cellChangeCallBack);
		});
	}
})(angular);