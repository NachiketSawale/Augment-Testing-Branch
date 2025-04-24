/**
 * Created by wed on 11/19/2018.
 */
(function (angular) {

	'use strict';

	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).controller('procurementPriceComparisonBoQPrintController', [
		'_',
		'globals',
		'$http',
		'$scope',
		'$translate',
		'platformGridAPI',
		'platformObjectHelper',
		'platformRuntimeDataService',
		'platformTranslateService',
		'procurementPriceComparisonPrintSettingService',
		'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonSettingConfiguration',
		function (_,
			globals,
			$http,
			$scope,
			$translate,
			platformGridAPI,
			platformObjectHelper,
			platformRuntimeDataService,
			platformTranslateService,
			printSettingService,
			printConstants,
			commonService,
			boqService,
			settingConfiguration) {

			$scope.boqOptions = [
				{
					gridData: {
						state: 'e4d010211c1946c085099dcf37fde7ab'
					},
					columns: [
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
							editor: 'description',
							field: 'DescriptionInfo.Translated',
							name: 'Type',
							name$tr$: 'cloud.common.entityDescription',
							width: 180,
							searchable: true
						}
					],
					dataProvider: {
						getList: function (settings) {
							return $http.get(globals.webApiBaseUrl + 'procurement/pricecomparison/print/getboqlinetypes').then(function (response) {
								var checkedLineTypes = platformObjectHelper.getValue(settings, 'generic.boq.checkedLineTypes'),
									lineTypes = checkedLineTypes || [],
									items = _.filter(response.data.BoqLineType, function (item) {
										return (item.Id >= 1 && item.Id <= 9) || item.Id === 103;
									});
								_.each(items, function (item) {
									item.index = item.Id === 103 ? 0 : item.Id;
									item.IsChecked = _.includes(lineTypes, item.Id) || !checkedLineTypes;
								});
								return _.sortBy(items, 'index');
							});
						}
					},
					settings: null,
					printCollectSettings: function () {
						var rows = getGridRows(this.gridData.state), checkedRows = _.filter(rows, {IsChecked: true});
						printSettingService.setCurrentGenericSetting({
							boq: {
								checkedLineTypes: _.map(checkedRows, function (item) {
									return item.Id;
								}),
								hideZeroValueLines: this.settings.generic.boq.hideZeroValueLines,
								percentageLevels: this.settings.generic.boq.percentageLevels
							}
						});
					},
					compareCollectSettings: function () {
						var rows = getGridRows(this.gridData.state), checkedRows = _.filter(rows, {IsChecked: true});
						commonService.typeSummary = angular.extend(commonService.typeSummary, {
							checkedLineTypes: _.map(checkedRows, function (item) {
								return item.Id;
							}),
							hideZeroValueLines: this.settings.generic.boq.hideZeroValueLines,
							percentageLevels: this.settings.generic.boq.percentageLevels
						});
					},
					onHideZeroValueLinesChanged:function() {
						printSettingService.onCurrentSettingChanged.fire({
							eventName: printConstants.eventNames.genericClickChange
						});
					},
					render: function (settings) {
						this.settings = settings;
						var gridId = this.gridData.state;
						initializeGrid(gridId, this.columns);
						this.dataProvider.getList(settings).then(function (items) {
							setDataReadOnly(items, [
								{field: 'DescriptionInfo.Translated', readonly: true}
							]);
							platformGridAPI.items.data(gridId, items);
							platformGridAPI.grids.invalidate(gridId);
						});
					},
					onPercentageLevelsChanged: function (){

					}
				}
			];

			var fromUI = 'fromUI';
			var fromTypeList = $scope.model ? $scope.model.split('.') : '';
			$scope.fromType = fromTypeList.length > 1 ? fromTypeList[1] : '';

			function setDataReadOnly(items, readonlyFields) {
				_.each(items, function (item) {
					platformRuntimeDataService.readonly(item, readonlyFields);
				});
			}

			function initializeGrid(gridId, columns) {
				if (!platformGridAPI.grids.exist(gridId)) {
					platformTranslateService.translateGridConfig(columns);
					var grid = {
						columns: columns,
						data: [],
						id: gridId,
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

			function getGridRows(gridId) {
				var grid = platformGridAPI.grids.element('id', gridId);
				if (grid && grid.dataView && grid.dataView.getRows) {
					return grid.dataView.getRows();
				}
				return null;
			}

			function initialize() {
				_.each($scope.boqOptions, function (option) {
					initializeGrid(option.gridData.state, option.columns);
				});
			}

			function loadSetting(eventInfo) {
				if ($scope.fromType === fromUI) {
					var fields = boqService.getCustomSettingsTypeSummaryFields();
					_.each($scope.boqOptions, function (option) {
						option.render({
							generic: {
								boq: fields
							}
						});
					});
				} else {
					var isApplyNewProfile = eventInfo && eventInfo.eventName === printConstants.eventNames.applyNewGenericProfile && eventInfo.profileType === printConstants.profileType.generic;
					if (!eventInfo || isApplyNewProfile) {
						printSettingService.getCurrentGenericSetting().then(function (genericProfile) {
							printSettingService.getCurrentRfqBoqSetting().then(function (rfqProfile) {
								_.each($scope.boqOptions, function (option) {
									option.render({
										generic: genericProfile,
										rfq: rfqProfile
									});
								});
							});
						});
					}
				}
			}

			function onPrintCollectSetting() {
				_.each($scope.boqOptions, function (option) {
					option.printCollectSettings();
				});
			}

			function onCompareCollectSetting() {
				_.each($scope.boqOptions, function (option) {
					option.compareCollectSettings();
				});
			}

			initialize();
			loadSetting();

			if ($scope.fromType === fromUI) {
				commonService.onCompareCollectSetting.register(onCompareCollectSetting);
			} else {
				printSettingService.onCurrentSettingChanged.register(loadSetting);
				printSettingService.onCollectSetting.register(onPrintCollectSetting);
				platformGridAPI.events.register($scope.boqOptions[0].gridData.state, 'onCellChange', onCellChange);
				platformGridAPI.events.register($scope.boqOptions[0].gridData.state, 'onHeaderCheckboxChanged', onCellChange);
			}

			function onCellChange() {
				printSettingService.onCurrentSettingChanged.fire({
					eventName: printConstants.eventNames.genericClickChange
				});
			}

			function loadFinish() {
				var gids = settingConfiguration.getGids();
				commonService.registerLoadFinish.fire({
					value: gids.summaryCompareField
				});
				platformGridAPI.events.unregister($scope.boqOptions[0].gridData.state, 'onRowCountChanged', loadFinish);
			}
			platformGridAPI.events.register($scope.boqOptions[0].gridData.state, 'onRowCountChanged', loadFinish);

			$scope.$on('$destroy', function () {
				if ($scope.fromType === fromUI) {
					commonService.onCompareCollectSetting.unregister(onCompareCollectSetting);
				} else {
					printSettingService.onCurrentSettingChanged.unregister(loadSetting);
					printSettingService.onCollectSetting.unregister(onPrintCollectSetting);
					platformGridAPI.events.unregister($scope.boqOptions[0].gridData.state, 'onCellChange', onCellChange);
					platformGridAPI.events.unregister($scope.boqOptions[0].gridData.state, 'onHeaderCheckboxChanged', onCellChange);
				}
				platformGridAPI.grids.unregister($scope.boqOptions[0].gridData.state);
			});
		}
	]);
})(angular);