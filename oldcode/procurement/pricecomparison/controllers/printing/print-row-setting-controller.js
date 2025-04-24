/**
 * Created by ada on 2018/10/8.
 */
(function (angular) {

	'use strict';

	angular.module('procurement.pricecomparison').controller('procurementPriceComparisonPrintRowSettingController', [
		'_',
		'$q',
		'$scope',
		'$timeout',
		'platformGridAPI',
		'platformTranslateService',
		'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonPrintSettingService',
		'procurementPriceComparisonSettingUiService',
		'procurementPriceComparisonMainService',
		'procurementPriceComparisonBoqService',
		'procurementPriceComparisonItemService',
		function (
			_,
			$q,
			$scope,
			$timeout,
			platformGridAPI,
			platformTranslateService,
			printConstants,
			printSettingService,
			settingUiService,
			mainDataService,
			boqService,
			itemService) {

			const printType = printSettingService.getCurrentPrintType();
			const compareType = printConstants.compareType[printType];

			let config = {
				type: printType,
				id: 'Print',
				name: 'Print',
				name$tr$: 'procurement.pricecomparison.printing.print',
				quoteFields: '0f36ec99b5fa42b4838440bed6401a5d',
				billingSchemaFields: 'c2a3a39dee9b4bd8a47258ede0abee62',
				itemFields: '455022959b1f46a086182d049bb91a51'
			};

			let resizeTimerIds = [];
			let grids = {
				'settings.quote.row': config.quoteFields,
				'settings.billingschema.row': config.billingSchemaFields,
				'settings.row': config.itemFields
			};

			let formConfig = settingUiService.getStandardConfigForDetailView(printType);
			platformTranslateService.translateFormConfig(formConfig);
			$scope.entity = {
				quoteFields: [],
				itemFields: [],
				billingSchemaFields: [],
				item: config,
				isVerticalCompareRows: false,
				isLineValueColumn: false,
				isFinalShowInTotal: false,
				isCalculateAsPerAdjustedQuantity: false
			};

			// set default value
			$scope.containerOptions = {
				formOptions: {
					configure: formConfig
				}
			};

			function resizeGrids(grids, timeout) {
				return $timeout(function () {
					grids.forEach((grid) => {
						platformGridAPI.grids.resize(grid);
					});
				}, timeout || 0);
			}

			function loadSetting(eventInfo) {
				let isApplyNewProfile = eventInfo && eventInfo.eventName === printConstants.eventNames.applyNewGenericProfile && eventInfo.profileType === printConstants.profileType.generic;
				let isReloadProfile = eventInfo && eventInfo.eventName === printConstants.eventNames.loadProfileFromBase;
				if (!eventInfo || isApplyNewProfile || isReloadProfile) {
					printSettingService.getCurrentGenericSetting().then(function (profile) {

						let baseConfigPromise = printType === printConstants.printType.item ? [itemService.getCustomSettingsCompareQuoteRowsAsync(), itemService.getCustomSettingsCompareBillingSchemaRowsAsync(), itemService.getCustomSettingsCompareRowsAsync()]
							: [boqService.getCustomSettingsCompareQuoteRowsAsync(), boqService.getCustomSettingsCompareBillingSchemaRowsAsync(), boqService.getCustomSettingsCompareRowsAsync()];

						$q.all(baseConfigPromise).then(function (response) {
							// set the data by profile data
							$scope.entity = {
								quoteFields: profile.row[compareType] ? profile.row[compareType].quoteFields : [],
								itemFields: profile.row[compareType] ? profile.row[compareType].itemFields : [],
								billingSchemaFields: profile.row[compareType] ? profile.row[compareType].billingSchemaFields : [],
								item: config,
								isVerticalCompareRows: profile.row[compareType] ? profile.row[compareType].isVerticalCompareRows : false,
								isLineValueColumn: profile.row[compareType] ? profile.row[compareType].isLineValueColumn : $scope.entity.isVerticalCompareRows,
								isFinalShowInTotal: profile.row[compareType] ? profile.row[compareType].isFinalShowInTotal : false,
								isBoq: printType === printConstants.printType.boq
							};

							if (printType === printConstants.printType.boq) {
								$scope.entity.isCalculateAsPerAdjustedQuantity = profile.row[compareType] ? profile.row[compareType].isCalculateAsPerAdjustedQuantity : false;
							}

							// get the translation from base configuration
							$scope.entity.quoteFields = printSettingService.formatterRowData(response[0], $scope.entity.quoteFields);
							$scope.entity.billingSchemaFields = printSettingService.formatterRowData(response[1], $scope.entity.billingSchemaFields);
							$scope.entity.itemFields = printSettingService.formatterRowData(response[2], $scope.entity.itemFields);
							printSettingService.onCurrentSettingChanged.fire({
								eventName: printConstants.eventNames.rowConfigChange,
								value: $scope.entity
							});
						});
					});
				} else if (eventInfo && eventInfo.eventName === printConstants.eventNames.containerSizeChange) {
					resizeGrids([config.quoteFields, config.billingSchemaFields, config.itemFields]);
				}
			}

			function onCollectSetting() {
				let result = {
					row: {}
				};
				result.row[compareType] = {
					billingSchemaFields: $scope.entity.billingSchemaFields,
					isLineValueColumn: $scope.entity.isLineValueColumn,
					isVerticalCompareRows: $scope.entity.isVerticalCompareRows,
					isFinalShowInTotal: $scope.entity.isFinalShowInTotal,
					isCalculateAsPerAdjustedQuantity: $scope.entity.isCalculateAsPerAdjustedQuantity,
					itemFields: $scope.entity.itemFields,
					quoteFields: $scope.entity.quoteFields
				};
				printSettingService.setCurrentGenericSetting(result);
			}

			loadSetting();

			printSettingService.onCollectSetting.register(onCollectSetting);
			printSettingService.onCurrentSettingChanged.register(loadSetting);

			let unregisterWatches = _.map($scope.containerOptions.formOptions.configure.groups, function watchMapFn(group, index) {
				return $scope.$watch('containerOptions.formOptions.configure.groups[' + index + '].isOpen', function watchCb() {
					const gridId = grids[$scope.containerOptions.formOptions.configure.groups[index].gid];
					$timeout.cancel(resizeTimerIds[index]);
					resizeTimerIds[index] = resizeGrids([gridId], 200);
				});
			});

			$scope.$on('$destroy', function () {
				printSettingService.onCurrentSettingChanged.unregister(loadSetting);
				printSettingService.onCollectSetting.unregister(onCollectSetting);
				_.over(unregisterWatches)();
			});

		}]);
})(angular);