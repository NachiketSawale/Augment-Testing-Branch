(function (angular) {
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	angular.module(moduleName).controller('printAbcAnalysisController', [
		'$scope',
		'$translate',
		'platformObjectHelper',
		'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonPrintSettingService',
		'procurementPriceComparisonPrintCommonService',
		'procurementPriceComparisonCommonService',
		'procurementPriceComparisonCommonHelperService',
		'procurementPriceComparisonCheckBidderService',
		function ($scope,
			$translate,
			platformObjectHelper,
			lookupDescriptorService,
			printConstants,
			printSettingService,
			printCommonService,
			commonService,
			commonHelperService,
			checkBidderService) {

			$scope.settings = {
				filterBasis: {
					selectedValue: -12,
					options: {
						items: [
							{
								name: $translate.instant('procurement.pricecomparison.compareMinValueIncludeTarget'),
								key: commonService.constant.minValueIncludeTarget,
								isBidder: false,
								value: -12
							},
							{
								name: $translate.instant('procurement.pricecomparison.compareMaxValueIncludeTarget'),
								key: commonService.constant.maxValueIncludeTarget,
								isBidder: false,
								value: -13
							},
							{
								name: $translate.instant('procurement.pricecomparison.compareAverageValueIncludeTarget'),
								key: commonService.constant.averageValueIncludeTarget,
								isBidder: false,
								value: -14
							}
						],
						valueMember: 'value',
						displayMember: 'name',
						selected: -12
					},
					onChange: function () {
						printSettingService.onCurrentSettingChanged.fire({
							eventName: printConstants.eventNames.rfqClickChange
						});
					}
				},
				criteria: {
					selectedValue: 1,
					totalPercent: 0.00,
					singlePercent: 0.00,
					amount: 0,
					onSelectChanged: function (value) {
						$scope.settings.criteria.selectedValue = value;
						printSettingService.onCurrentSettingChanged.fire({
							eventName: printConstants.eventNames.rfqClickChange
						});
					}
				}
			};
			var baseCriteria = angular.copy($scope.settings.filterBasis.options.items);

			function loadSetting(eventInfo) {
				var isApplyNewProfile = eventInfo &&
					eventInfo.eventName === printConstants.eventNames.applyNewGenericProfile &&
					eventInfo.profileType === printConstants.profileType.boq;

				if (!eventInfo || isApplyNewProfile) {
					printSettingService.getCurrentGenericSetting().then(function (genericProfile) {
						printSettingService.getCurrentRfqBoqSetting().then(function (rfqProfile) {
							var bidders = platformObjectHelper.getValue(rfqProfile, 'bidder.quotes', []),
								baseBidders = platformObjectHelper.getValue(genericProfile, 'bidder', []),
								quoteIds = _.map(bidders, function (item) {
									return item.QtnHeaderFk;
								});
							if (!!baseBidders && !!baseBidders.boq) {
								bidders = commonHelperService.getAllBidders(baseBidders.boq, bidders);
							}
							$scope.settings.filterBasis.options.items = angular.copy(baseCriteria);
							commonHelperService.getCompareColumns(2, quoteIds).then(function (result) {
								_.forEach(bidders, function (item) {
									if (item.Visible && !checkBidderService.boq.isBase(item.Id) && !item.CompareColumnFk) {
										var quote = _.find(result.data.Quotes, {Id: item.QtnHeaderFk});
										addBidder(item, quote);
									}
								});
								$scope.settings = printCommonService.merge2($scope.settings, {
									filterBasis: rfqProfile.analysis ? rfqProfile.analysis.filterBasis : {},
									criteria: rfqProfile.analysis ? rfqProfile.analysis.criteria : {}
								});
								if (rfqProfile.analysis) {
									setDefaultSelected(rfqProfile.analysis.filterBasis);
								}
							});
						});
					});
				}
			}

			function setDefaultSelected(filterBasis) {
				var selectedItem = _.find($scope.settings.filterBasis.options.items, function (item) {
					return filterBasis.selectedValue === item.value;
				});
				if (!selectedItem) {
					$scope.settings.filterBasis.selectedValue = -12;
					$scope.settings.filterBasis.options.selected = -12;
				} else {
					$scope.settings.filterBasis.selectedValue = filterBasis.selectedValue;
					$scope.settings.filterBasis.options.selected = filterBasis.selectedValue;
				}
			}

			function formatterKey(item, quote) {
				var quoteVersion = -1;
				if (!item.BusinessPartnerFk) {
					item.BusinessPartnerFk = item.QtnHeaderFk;
				}
				if (quote) {
					quoteVersion = quote.QuoteVersion;
				} else {
					quoteVersion = item.QtnHeaderFk;
				}
				return commonService.constant.prefix2 +
					commonService.constant.columnFieldSeparator + item.QtnHeaderFk +
					commonService.constant.columnFieldSeparator + item.BusinessPartnerFk +
					commonService.constant.columnFieldSeparator + quoteVersion;
			}

			function onCollectSetting() {
				if (!$scope.settings.filterBasis || !$scope.settings.criteria) {
					printSettingService.setCurrentRfqBoqSetting({
						analysis: {
							filterBasis: {},
							criteria: {}
						}
					});
					return;
				}

				var option = _.find($scope.settings.filterBasis.options.items, function (item) {
					return item.value === $scope.settings.filterBasis.selectedValue;
				});
				printSettingService.setCurrentRfqBoqSetting({
					analysis: {
						filterBasis: {
							selectedValue: $scope.settings.filterBasis.selectedValue,
							selectedItem: option
						},
						criteria: {
							selectedValue: $scope.settings.criteria.selectedValue,
							totalPercent: $scope.settings.criteria.totalPercent,
							singlePercent: $scope.settings.criteria.singlePercent,
							amount: $scope.settings.criteria.amount
						}
					}
				});
			}

			function bidderVisibleChange(eventInfo) {
				if (eventInfo.eventName === printConstants.eventNames.bidderVisibleNumChange) {
					$scope.settings.filterBasis.options.items = angular.copy(baseCriteria);
					var allQuote = lookupDescriptorService.getData('quote');
					_.forEach(eventInfo.visibleBidders, function (bidder) {
						if (!checkBidderService.boq.isBase(bidder.QtnHeaderFk)) {
							var quote = _.find(allQuote, {Id: bidder.QtnHeaderFk});
							addBidder(bidder, quote);
						}
					});
					var selectedItem = _.find($scope.settings.filterBasis.options.items, function (item) {
						return $scope.settings.filterBasis.selectedValue === item.value;
					});
					if (!selectedItem) {
						$scope.settings.filterBasis.selectedValue = -12;
						$scope.settings.filterBasis.options.selected = -12;
					}
				}
			}

			function addBidder(item, quote) {
				var code = quote ? '(' + quote.Code + ')' : '';
				var bidder = {
					name: item.DescriptionInfo.Translated + code,
					isBidder: true,
					key: formatterKey(item, quote),
					value: item.QtnHeaderFk
				};
				var hasBidder = _.find($scope.settings.filterBasis.options.items, function (item) {
					return item.key === bidder.key;
				});
				if (!hasBidder) {
					$scope.settings.filterBasis.options.items.push(bidder);
				}
			}

			printSettingService.onCollectSetting.register(onCollectSetting);
			printSettingService.onCurrentSettingChanged.register(loadSetting);
			printSettingService.onCurrentSettingChanged.register(bidderVisibleChange);
			loadSetting();

			$scope.$on('$destroy', function () {
				printSettingService.onCurrentSettingChanged.unregister(loadSetting);
			});

		}
	]);
})(angular);