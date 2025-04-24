/*
* $Id$
* Copyright (c) RIB Software AG
*/

(function (angular) {
	'use strict';

	let moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).controller('controllingProjectcontrolsVersionComparisonController', structureController);

	structureController.$inject = [
		'$scope',
		'$translate',
		'_',
		'$timeout',
		'platformGridAPI',
		'mainViewService',
		'reportingPrintService',
		'platformGridControllerService',
		'controllingProjectcontrolsVersionComparisonStructureService',
		'controllingProjectControlsVersionComparisonUIConfigService',
		'projectControlsGroupingType',
		'controllingProjectcontrolsVersionComparisonService',
		'controllingProjectcontrolsDashboardControllerExtendService',
		'controllingProjectcontrolsCompareDataInfo',
		'projectControlsComparisonVersionType',
		'controllingProjectControlsVersionComparisonConfigService',
	];

	function structureController($scope, $translate, _, $timeout, platformGridAPI, mainViewService, reportingPrintService, platformGridControllerService,
		dashboardStructureService, uiConfigurationService, projectControlsGroupingType, dashboardDataService, dashboardControllerExtendService, compareDataInfo, comparisonVersionType, versionComparisonConfigService) {
		$scope.config = uiConfigurationService.getStandardConfigForListView();
		$scope.scheme = uiConfigurationService.getDtoScheme();
		$scope.groupingColumns = angular.copy(projectControlsGroupingType);

		dashboardControllerExtendService.renameColumns($scope.config.columns);

		const statusBarVersionIdOfVersionA = 'historyVersion_version_A';
		const statusBarVersionIdOfVersionB = 'historyVersion_version_B';
		const statusBarPeriodIdOfVersionA = 'period_version_A';
		const statusBarPeriodIdOfVersionB = 'period_version_B';
		const statusBarConfigHeader = 'config_header';

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

		platformGridControllerService.initListController($scope, uiConfigurationService, dashboardDataService, null, myGridConfig);

		dashboardDataService.setGridId($scope.gridId);

		let sb = $scope.getUiAddOns().getStatusBar();

		sb.showFields([
			{align: 'right', id: 'label_version_A', cssClass: 'font-bold', toolTip: '', type: 'text', visible: true, value: $translate.instant('controlling.projectcontrols.versionComparison.controllingVersionA') + ': '},
			{
				id: statusBarVersionIdOfVersionA,
				align: 'right',
				type: 'dropdown-btn',
				value: $translate.instant('controlling.projectcontrols.containerTitleControllingVersion')
			},
			{
				id: 'Dv0',
				type: 'divider'
			},
			{
				id: statusBarPeriodIdOfVersionA,
				align: 'right',
				type: 'dropdown-btn',
				value: $translate.instant('controlling.projectcontrols.reportPeriod')
			},
			{
				id: 'Dv1',
				type: 'divider'
			},
			{align: 'right', id: 'label_version_B', cssClass: 'font-bold', toolTip: '', type: 'text', visible: true, value: $translate.instant('controlling.projectcontrols.versionComparison.controllingVersionB') + ': '},
			{
				id: statusBarVersionIdOfVersionB,
				align: 'right',
				type: 'dropdown-btn',
				value: $translate.instant('controlling.projectcontrols.containerTitleControllingVersion')
			},
			{
				id: 'Dv2',
				type: 'divider'
			},
			{
				id: statusBarPeriodIdOfVersionB,
				align: 'right',
				type: 'dropdown-btn',
				value: $translate.instant('controlling.projectcontrols.reportPeriod')
			},
			{
				id: 'Dv3',
				type: 'divider'
			},
			{
				id: statusBarConfigHeader,
				align: 'last',
				type: 'dropdown-btn',
				iconClass: 'tlb-icons ico-settings',
				toolTip:$translate.instant('controlling.projectcontrols.versionComparison.configHeader')
			}]);

		sb.setVisible(true);

		function getTranslation(item){
			if(item && item.DescriptionInfo){
				return item.DescriptionInfo.Translated || item.DescriptionInfo.Description;
			}
			return '';
		}

		updateComparisonConfigField(versionComparisonConfigService.getCompareConfigSelected() ? getTranslation(versionComparisonConfigService.getCompareConfigSelected()) : '');

		function updateComparisonConfigField(selectedComparisonConfig){
			let comparisonItems = _.map(versionComparisonConfigService.getCompareConfigs(), function (item) {
				return {
					id: item.Id,
					caption: getTranslation(item),
					type: 'item',
					fn: function (e, args) {
						versionComparisonConfigService.setCompareConfigSelectedById(args.id);
						updateVersionFieldInternal(args.caption);
						mainViewService.customData($scope.gridId, 'comparisonHeaderInfo', { Id : args.id });
						//refresh the container
						versionComparisonConfigService.loadConfigById(args.id).then(function (config) {
							if(config){
								const columns = uiConfigurationService.getStandardConfigForListView().columns;
								platformGridAPI.columns.configuration($scope.gridId, angular.copy(columns));
								dashboardDataService.load();
							}
						});

					}
				};
			});

			function updateVersionFieldInternal(caption) {
				sb.updateFields([{
					id: statusBarConfigHeader,
					align: 'right',
					type: 'dropdown-btn',
					toolTip:$translate.instant('controlling.projectcontrols.versionComparison.configHeader'),
					value: caption,
					list: {
						items: comparisonItems
					}
				}]);
			}

			updateVersionFieldInternal(selectedComparisonConfig || '');
		}

		function updateVersionField(selectedVersion, comparisonVersionType, statusBarVersionId) {
			let historyVersionItems = _.map(compareDataInfo.getVersions(), function (item) {
				return {
					id: item.ribPrjHistroyKey,
					caption: item.value,
					type: 'item',
					fn: function (e, args) {
						compareDataInfo.setSelectVersion(comparisonVersionType, args);
						updateVersionFieldInternal('Version ' + args.caption);
						historyVersionChanged(comparisonVersionType);
					}
				};
			});

			function updateVersionFieldInternal(caption) {
				sb.updateFields([{
					id: statusBarVersionId,
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

		function updatePeriodField(selectedPeriod, comparisonVersionType, statusBarPeriodId) {
			let periodItems = _.map(compareDataInfo.getPeriods(comparisonVersionType), function (item) {
				return {
					id: item.value,
					caption: item.value,
					type: 'item',
					description: item.description,
					fn: function (e, args) {
						compareDataInfo.setSelectPeriod(comparisonVersionType, args);
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
					id: statusBarPeriodId,
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

		/******************************************************************************************
		 *  Lifecycle Hooks for generic structure container.
		 ******************************************************************************************/
		dashboardControllerExtendService.extendForGenericStructure($scope, dashboardDataService, dashboardStructureService);

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
						if (compareDataInfo.isValidated()) {
							return false;
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
					value: compareDataInfo.showEmptyData(),
					iconClass: 'tlb-icons ico-empty-line-hide-show',
					disabled: function () {
						return false;
					},
					fn: function refresh() {
						compareDataInfo.toggleShowEmptyData();
					}
				}
			],
			update: function () {
				++$scope.tools.version;
			}
		});

		function getPeriodByVersionType(comparisonVersionType){
			return comparisonVersionType === comparisonVersionType.COLUMN ? statusBarPeriodIdOfVersionA : statusBarPeriodIdOfVersionB;
		}

		function historyVersionChanged(versionType) {
			dashboardDataService.loadPeriods(versionType, function (historyVersion) {
				updatePeriodField(historyVersion && historyVersion.periodSelectedId ? historyVersion.periodSelectedId : null, versionType, getPeriodByVersionType(versionType));
				dashboardDataService.load();
			});
		}

		function onGroupConfigChanged(prjClassifications) {
			getGroupingColumnsTranslation(projectControlsGroupingType);
			let groupingColumns = angular.copy(projectControlsGroupingType);
			for (let i = 1; i < 5; i++) {
				let prjClassification = prjClassifications ? prjClassifications[i] : null;
				if (prjClassification) {
					let groupingColumn = _.find(groupingColumns, {id: 'CostGroup' + i});
					if (groupingColumn) {
						groupingColumn.name = $translate.instant('controlling.projectcontrols.costGroup' + i) + '-' + prjClassification.ClasCatologId;
					}
				}
			}

			$timeout(function () {
				$scope.groupingColumns = groupingColumns;
			}, 0);
		}

		function getGroupingColumnsTranslation(groupingColumns) {
			if (groupingColumns) {
				_.forEach(groupingColumns, (item) => {
					item.name = $translate.instant(item.name$tr$);
				});
			}
		}

		getGroupingColumnsTranslation($scope.groupingColumns);

		function onHistoryVersionChanged(compareDataInfo) {
			const selectedVersionA = compareDataInfo ? compareDataInfo.getSelectVersion(comparisonVersionType.VersionA) : null;
			const selectedVersionB = compareDataInfo ? compareDataInfo.getSelectVersion(comparisonVersionType.VersionB) : null;
			updateVersionField(selectedVersionA && selectedVersionA.ribHistoryId > 0 ? selectedVersionA.ribHistoryId : null, comparisonVersionType.VersionA, statusBarVersionIdOfVersionA);
			updateVersionField(selectedVersionB && selectedVersionB.ribHistoryId > 0 ? selectedVersionB.ribHistoryId : null, comparisonVersionType.VersionB, statusBarVersionIdOfVersionB);
			updatePeriodField(selectedVersionA ? selectedVersionA.periodSelectedId : null, comparisonVersionType.VersionA, statusBarPeriodIdOfVersionA);
			updatePeriodField(selectedVersionB ? selectedVersionB.periodSelectedId : null, comparisonVersionType.VersionB, statusBarPeriodIdOfVersionB);
		}

		dashboardDataService.forceLoadService();

		onHistoryVersionChanged(compareDataInfo);

		dashboardDataService.registerHistoryVersionChanged(onHistoryVersionChanged);

		dashboardDataService.registerGroupingConfigChanged(onGroupConfigChanged);

		function onGridRenderCompleted() {
			platformGridAPI.events.unregister($scope.gridId, 'onRenderCompleted', onGridRenderCompleted);
			if (_.isFunction(dashboardDataService.forceReloadAfterFirstInit)) {
				dashboardDataService.forceReloadAfterFirstInit();
				dashboardDataService.forceReloadAfterFirstInit = null;
			}
		}

		platformGridAPI.events.register($scope.gridId, 'onRenderCompleted', onGridRenderCompleted);

		// un-register on destroy
		$scope.$on('$destroy', function () {
			dashboardDataService.unregisterHistoryVersionChanged(onHistoryVersionChanged);

			dashboardDataService.unregisterGroupingConfigChanged(onGroupConfigChanged);
		});
	}
})(angular);