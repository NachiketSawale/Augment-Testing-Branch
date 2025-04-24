(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	angular.module(moduleName).controller('procurementPricecomparisonPrcBoqItemType2Controller',
		['$scope', 'platformGridAPI', 'procurementtPricecomparisonPrcBoqItemType2Service',
			'platformTranslateService',
			'platformRuntimeDataService',
			'procurementPriceComparisonPrintConstants',
			'procurementPriceComparisonPrintSettingService',
			'procurementPriceComparisonBoqService',
			'procurementPriceComparisonCommonService',
			'procurementPriceComparisonSettingConfiguration',
			'procurementPriceComparisonHeaderCheckHelperService',
			'procurementPriceComparisonCommonHelperService',
			function ($scope, platformGridAPI, prcBoqItemType2Service,
				platformTranslateService,
				platformRuntimeDataService,
				printConstants,
				printSettingService,
				boqService,
				commonService,
				settingConfiguration,
				headerCheckHelperService,
				commonHelperService) {

				$scope.data = [];
				$scope.gridId = '4759D4BC86CC454FABA90BB287CD9D58';
				$scope.fromType = $scope.$parent && $scope.$parent.fromType ? $scope.$parent.fromType : '';
				var printType = printSettingService.getCurrentPrintType();

				var fromUI = 'fromUI';

				$scope.gridData2 = {
					state: $scope.gridId
				};

				function setupMappingGrid() {

					if (!platformGridAPI.grids.exist($scope.gridId)) {

						var tempColumns = [
							{
								id: 'IsChecked',
								field: 'IsChecked',
								name: 'All',
								name$tr$: 'procurement.pricecomparison.printing.All',
								formatter: 'boolean',
								editor: 'boolean',
								width: 60,
								headerChkbox: true
							},
							{
								id: 'description',
								formatter: 'description',
								field: 'DescriptionInfo.Translated',
								name: 'Type2',
								name$tr$: 'cloud.common.entityDescription',
								width: 180,
								searchable: true
							}];

						if ($scope.fromType === fromUI || printType === printConstants.printType.boq) {
							tempColumns.push({
								id: 'userFieldName',
								formatter: 'description',
								editor: $scope.fromType === fromUI ? 'description' : null,
								name: 'User label name',
								name$tr$: 'cloud.desktop.formConfigCustomerLabelName',
								field: 'UserLabelName',
								width: 150,
								hidden: false
							});
						}

						platformTranslateService.translateGridConfig(tempColumns);
						var grid = {
							columns: tempColumns,
							data: [],
							id: $scope.gridId,
							lazyInit: true,
							enableConfigSave: false,
							isStaticGrid: true,
							options: {
								indicator: true,
								editable: true,
								idProperty: 'Id',
								iconClass: ''
							}
						};

						platformGridAPI.grids.config(grid);
					}
				}

				var init = function () {
					setupMappingGrid();
					loadSetting();
				};

				init();

				function loadSetting(eventInfo) {
					if ($scope.fromType === fromUI) {
						prcBoqItemType2Service.getBoqItemType2List().then(function (response) {
							var summaryInfo = boqService.getCustomSettingsTypeSummaryFields();

							mergeItemTypes(response.data, summaryInfo);

							platformGridAPI.items.data($scope.gridId, response.data);
							platformGridAPI.grids.invalidate($scope.gridId);
						});
					} else {
						var isApplyNewProfile = eventInfo && eventInfo.eventName === printConstants.eventNames.applyNewGenericProfile && eventInfo.profileType === printConstants.profileType.generic;
						if (!eventInfo || isApplyNewProfile) {
							getGeneric();
						}
					}
				}

				function getGeneric() {
					printSettingService.getCurrentGenericSetting().then(function (profile) {
						var profileData = printType === printConstants.printType.item ? profile.item : profile.boq;
						if (profileData) {
							prcBoqItemType2Service.getBoqItemType2List().then(function (response2) {

								mergeItemTypes(response2.data, profileData);

								platformGridAPI.items.data($scope.gridId, response2.data);
								platformGridAPI.grids.invalidate($scope.gridId);
							});
						}
					});
				}

				function onCompareCollectSetting() {
					var rows = getGridRows($scope.gridId), checkedRows = _.filter(rows, {IsChecked: true});
					commonService.typeSummary = angular.extend(commonService.typeSummary, {
						checkedBoqItemTypes2: _.map(checkedRows, function (item) {
							return item.Id;
						}),
						boqItemTypes2Infos: _.map(rows, function (row) {
							return {
								Id: row.Id,
								UserLabelName: row.UserLabelName || ''
							};
						})
					});
				}

				function getGridRows(gridId) {
					var grid = platformGridAPI.grids.element('id', gridId);
					if (grid && grid.dataView && grid.dataView.getRows) {
						return grid.dataView.getRows();
					}
					return null;
				}

				if ($scope.fromType === fromUI) {
					commonService.onCompareCollectSetting.register(onCompareCollectSetting);
					platformGridAPI.events.register($scope.gridId, 'onCellChange', itemTypeReadonlyFire);
					platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', itemTypeReadonlyFire);
				} else {
					printSettingService.onCurrentSettingChanged.register(loadSetting);
					platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);
					platformGridAPI.events.register($scope.gridId, 'onHeaderCheckboxChanged', onCellChange);
				}

				function itemTypeReadonlyFire(eventInfo, itemObj) {
					var rows = getGridRows($scope.gridId);
					commonHelperService.itemTypeReadonlyFire(itemObj, rows, 'itemType2');
				}

				function onCellChange(eventInfo, itemObj) {
					var rows = getGridRows($scope.gridId);
					commonHelperService.itemTypeReadonlyFire(itemObj, rows, 'itemType2');
					printSettingService.onCurrentSettingChanged.fire({
						eventName: printConstants.eventNames.genericClickChange
					});
				}

				function itemTypeReadonlyRegister(eventInfo) {
					commonHelperService.itemTypeReadonlyRegister(eventInfo, $scope.gridId, 'itemType1', headerCheckHelperService);
				}

				commonService.onItemTypeReadonly.register(itemTypeReadonlyRegister);

				function loadFinish() {
					var gids = settingConfiguration.getGids();
					commonService.registerLoadFinish.fire({
						value: gids.summaryCompareField,
						type: 'itemTypeReadonly'
					});
					platformGridAPI.events.unregister($scope.gridId, 'onRowCountChanged', loadFinish);
				}

				function mergeItemTypes(itemTypes, summaryInfo) {
					var hasCheckedBoqItemTypesAssigned = summaryInfo && summaryInfo.checkedBoqItemTypes2;
					var hasBoqItemTypesInfosAssigned = summaryInfo && summaryInfo.boqItemTypes2Infos;

					_.forEach(itemTypes, function itemTypeIterator(resItem) {

						if (hasCheckedBoqItemTypesAssigned) {
							resItem.IsChecked = _.includes(summaryInfo.checkedBoqItemTypes2, resItem.Id);
						} else {
							resItem.IsChecked = true;
						}

						if (hasBoqItemTypesInfosAssigned) {
							var target = _.find(summaryInfo.boqItemTypes2Infos, {Id: resItem.Id});
							if (target) {
								resItem.UserLabelName = target.UserLabelName;
							}
						}

					});
				}

				platformGridAPI.events.register($scope.gridId, 'onRowCountChanged', loadFinish);

				$scope.$on('$destroy', function () {
					if ($scope.fromType === fromUI) {
						commonService.onCompareCollectSetting.unregister(onCompareCollectSetting);
						platformGridAPI.events.unregister($scope.gridId, 'onCellChange', itemTypeReadonlyFire);
						platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', itemTypeReadonlyFire);
					} else {
						printSettingService.onCurrentSettingChanged.unregister(loadSetting);
						platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onCellChange);
						platformGridAPI.events.unregister($scope.gridId, 'onHeaderCheckboxChanged', onCellChange);
					}
					commonService.onItemTypeReadonly.unregister(itemTypeReadonlyRegister);
					platformGridAPI.grids.unregister($scope.gridId);
				});
			}
		]);

})(angular);