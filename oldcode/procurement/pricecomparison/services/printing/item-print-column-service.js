(function (angular) {

	'use strict';

	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonItemPrintColumnService', [
		'_', 'globals', '$q', '$http', 'procurementPriceComparisonMainService', 'platformModalService', '$translate', 'platformDataServiceSelectionExtension',
		'procurementPriceComparisonCommonService', 'platformRuntimeDataService', 'platformGridAPI', 'platformObjectHelper',
		'procurementPriceComparisonItemColumnFactory', 'procurementPriceComparisonPrintSettingService', 'procurementPriceComparisonItemHelperService', 'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonCommonHelperService', 'basicsLookupdataLookupDescriptorService',
		function (_, globals, $q, $http, procurementPriceComparisonMainService, platformModalService, $translate, platformDataServiceSelectionExtension,
			commonService, platformRuntimeDataService, platformGridAPI, platformObjectHelper,
			itemColumnFactory, printSettingService, itemHelperService, printConstants,
			commonHelperService, lookupDescriptorService) {

			var serviceContainer = itemColumnFactory.getServiceContainer({
				route: 'procurement/pricecomparison/print/',
				endRead: 'list'
			});
			var service = serviceContainer.service;
			service.load = function () {
				var deferred = $q.defer();
				printSettingService.getCurrentGenericSetting().then(function (genericProfile) {
					printSettingService.getCurrentRfqItemSetting().then(function (profile) {
						var bidders = platformObjectHelper.getValue(profile, 'bidder.quotes', []),
							baseBidders = platformObjectHelper.getValue(genericProfile, 'bidder', []),
							quoteIds = _.map(bidders, function (item) {
								return item.QtnHeaderFk;
							});

						if (!!baseBidders && !!baseBidders.item) {
							bidders = commonHelperService.getAllBidders(baseBidders.item, bidders);
						}
						// set width ang group
						var bidderColumn = {};
						if (genericProfile.column && genericProfile.column.item) {
							bidderColumn = _.find(genericProfile.column.item.printColumns, {id: printConstants.bidderFieldName});
						}

						if (!genericProfile.report.bidderPageSizeCheck) {
							service.MaxBidderNum = commonHelperService.getVisibleBidderLength(bidders);
						} else {
							service.MaxBidderNum = _.min([genericProfile.report.bidderPageSize, commonHelperService.getVisibleBidderLength(bidders)]);
						}
						if (bidderColumn) {
							service.BidderWidth = parseInt(bidderColumn.width / service.MaxBidderNum);
						}

						commonHelperService.addBidderMessage(service.MaxBidderNum, service.BidderWidth, bidders);
						// set width readonly if visible is false
						_.forEach(bidders, function (bidder) {
							commonHelperService.setBidderReadonly(bidder);
						});

						commonHelperService.getCompareColumns(1, quoteIds).then(function (result) {
							deferred.resolve({Main: bidders, Quote: result.data.Quotes});
							_.forEach(result.data.BaseColumn, function (base) {
								var findBidder = _.find(bidders, {Id: base.Id});
								if (!findBidder) {
									bidders.unshift(base);
								}
							});
							lookupDescriptorService.updateData('quote', result.data.Quotes);
							var tree = itemHelperService.restructureQuoteCompareColumns(bidders, result.data.Quotes, false);
							serviceContainer.data.handleReadSucceeded(tree, serviceContainer.data);
						});
					});
				});

				return deferred.promise;
			};

			service.updateBidderMessage = function updateBidderMessage(maxBidderNum, bidderWidth, allBidders, item) {
				commonHelperService.updateBidderMessage(maxBidderNum, bidderWidth, allBidders, item);
				if (item) {
					commonHelperService.setBidderReadonly(item);
				}
				service.gridRefresh();
			};

			service.checkMaxBidderWidth = function checkMaxBidderWidth(item, allBidders) {
				var allBidderWidth = service.BidderWidth * service.MaxBidderNum;
				commonHelperService.checkMaxBidderWidth(item, allBidders, allBidderWidth);
				service.gridRefresh();
			};

			service.visibleBidderNumChange = function () {
				printSettingService.visibleBidderNumChange(service.getList());
			};

			service.clickChange = function clickChange() {
				printSettingService.onCurrentSettingChanged.fire({
					eventName: printConstants.eventNames.rfqClickChange
				});
			};

			return serviceContainer.service;

		}
	]);
})(angular);
