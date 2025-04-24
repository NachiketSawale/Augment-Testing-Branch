/**
 * Created by wed on 9/14/2018.
 */
(function (angular) {

	'use strict';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).controller('procurementPriceComparisonPrintItemBidderController', [
		'$scope',
		'$translate',
		'platformGridAPI',
		'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonItemPrintColumnService',
		'procurementPriceComparisonBoqPrintColumnService',
		'procurementPriceComparisonPrintSettingService',
		'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonCommonHelperService',
		'procurementPriceComparisonCheckBidderService',
		'procurementPriceComparisonSettingConfiguration',
		function ($scope,
			$translate,
			platformGridAPI,
			lookupDescriptorService,
			itemPrintColumnService,
			boqPrintColumnService,
			printSettingService,
			printConstants,
			commonHelperService,
			checkBidderService,
			settingConfiguration) {

			var printType = printSettingService.getCurrentPrintType(),
				compareType = printConstants.compareType[printType];

			var configure = settingConfiguration.getCurrentConfig().quoteCompareColumn;
			$scope.customSetting = configure.customSetting;

			if (printType === printConstants.printType.boq) {
				platformGridAPI.events.register($scope.customSetting.uuid, 'onCellChange', onBoqGridCellChange);
			} else {
				platformGridAPI.events.register($scope.customSetting.uuid, 'onCellChange', onItemGridCellChange);

			}

			function onCollectSetting() {

				var bidderBase = commonHelperService.getBaseBidders($scope.customSetting.dataService.getList());
				var bidderQuotes = {
					bidder: {
						quotes: $scope.customSetting.dataService.getList()
					}
				};
				var bidderBaseQuotes = {};
				bidderBaseQuotes[compareType] = bidderBase;
				if (printType === printConstants.printType.boq) {
					printSettingService.setCurrentRfqBoqSetting(bidderQuotes);
				} else {
					printSettingService.setCurrentRfqItemSetting(bidderQuotes);
				}

				printSettingService.setCurrentGenericSetting({
					bidder: bidderBaseQuotes
				});
			}

			function loadSetting(eventInfo) {
				var isGenericProfile = eventInfo && eventInfo.eventName === printConstants.eventNames.applyNewGenericProfile,
					isBidderChanged = eventInfo && eventInfo.eventName === printConstants.eventNames.bidderChange,
					isReloadProfile = eventInfo && eventInfo.eventName === printConstants.eventNames.loadProfileFromBase,
					isGeneric = eventInfo.profileType === printConstants.profileType.generic,
					isRfqProfile = eventInfo.profileType === printConstants.profileType.item || eventInfo.profileType === printConstants.profileType.boq;
				if (((isGenericProfile || isBidderChanged) && (isRfqProfile)) || isReloadProfile || isGeneric) {
					$scope.customSetting.dataService.load();
				}
			}

			function updateBidderMessage(eventInfo) {
				var maxBidderNum = $scope.customSetting.dataService.MaxBidderNum;
				var bidderWidth = $scope.customSetting.dataService.BidderWidth;
				if (eventInfo.eventName === printConstants.eventNames.maxBidderPageSizeChange) {
					var bidderPerSize = eventInfo.value.bidderPerSize,
						maxLength = commonHelperService.getVisibleBidderLength($scope.customSetting.dataService.getList());
					if (!eventInfo.value.bidderPerSizeCheck) {
						bidderPerSize = maxLength;
					}
					if ($scope.customSetting.dataService.MaxBidderNum !== bidderPerSize) {
						maxBidderNum = _.min([bidderPerSize, maxLength]);
						$scope.customSetting.dataService.MaxBidderNum = maxBidderNum;
						$scope.customSetting.dataService.updateBidderMessage(maxBidderNum, bidderWidth, $scope.customSetting.dataService.getList());
					}
				}
				if (eventInfo.eventName === printConstants.eventNames.bidderWidthChange &&
					($scope.customSetting.dataService.BidderWidth !== eventInfo.value)) {
					bidderWidth = eventInfo.value;
					$scope.customSetting.dataService.BidderWidth = bidderWidth;
					$scope.customSetting.dataService.updateBidderMessage(maxBidderNum, bidderWidth, $scope.customSetting.dataService.getList());
				}

			}

			function onBoqGridCellChange(event, args) {
				var columns = args.grid.getColumns(), columnName = columns[args.cell].field;// item = args.item;
				if (columnName === 'QtnHeaderFk') {
					printSettingService.setCurrentRfqBoqSetting({
						bidder: {
							quotes: $scope.customSetting.dataService.getList()
						}
					}, true, {
						eventName: printConstants.eventNames.bidderCountOrQuoteChange,
						count: $scope.customSetting.dataService.getList().length
					});
				}
				onItemGridCellChange(event, args);
			}

			function onItemGridCellChange(event, args) {
				if (checkBidderService.item.isReference(args.item.Id)) {
					printSettingService.onCurrentSettingChanged.fire({
						eventName: printConstants.eventNames.genericClickChange
					});
				} else {
					onGridCellChange();
				}
			}

			function onGridCellChange() {
				printSettingService.onCurrentSettingChanged.fire({
					eventName: printConstants.eventNames.rfqClickChange
				});
			}

			printSettingService.onCurrentSettingChanged.register(updateBidderMessage);
			printSettingService.onCurrentSettingChanged.register(loadSetting);
			printSettingService.onCollectSetting.register(onCollectSetting);

			var watchLengthChange = function () {
				return $scope.customSetting.dataService.getList().length;
			};
			var unWatchFn = $scope.$watchGroup([watchLengthChange], function (newValue, oldValue) {
				if (newValue[0] !== oldValue[0]) {
					var maxBidderNum = $scope.customSetting.dataService.MaxBidderNum;
					var bidderWidth = $scope.customSetting.dataService.BidderWidth;
					$scope.customSetting.dataService.updateBidderMessage(maxBidderNum, bidderWidth, $scope.customSetting.dataService.getList());
					printSettingService.setCurrentRfqBoqSetting({
						bidder: {
							quotes: $scope.customSetting.dataService.getList()
						}
					}, true, {
						eventName: printConstants.eventNames.bidderCountOrQuoteChange,
						count: newValue
					});
					$scope.customSetting.dataService.visibleBidderNumChange();
				}
			});

			$scope.$on('$destroy', function () {
				if (printType === printConstants.printType.boq) {
					platformGridAPI.events.unregister($scope.customSetting.uuid, 'onCellChange', onBoqGridCellChange);
				}
				unWatchFn();
				printSettingService.onCurrentSettingChanged.unregister(updateBidderMessage);
				printSettingService.onCollectSetting.unregister(onCollectSetting);
				printSettingService.onCurrentSettingChanged.unregister(loadSetting);
			});
		}
	]);
})(angular);