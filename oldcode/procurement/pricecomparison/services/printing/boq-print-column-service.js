(function (angular) {

	'use strict';

	var moduleName = 'procurement.pricecomparison';

	angular.module(moduleName).factory('procurementPriceComparisonBoqPrintColumnService', [
		'_', 'globals', '$q', '$http', 'procurementPriceComparisonMainService', 'platformModalService', '$translate', 'platformDataServiceSelectionExtension',
		'procurementPriceComparisonCommonService', 'platformRuntimeDataService', 'platformGridAPI', 'platformObjectHelper',
		'procurementPriceComparisonBoqColumnFactory', 'procurementPriceComparisonPrintSettingService', 'procurementPriceComparisonBoqHelperService', 'procurementPriceComparisonPrintConstants',
		'procurementPriceComparisonCommonHelperService', 'basicsLookupdataLookupDescriptorService',
		function (_, globals, $q, $http, procurementPriceComparisonMainService, platformModalService, $translate, platformDataServiceSelectionExtension,
			commonService, platformRuntimeDataService, platformGridAPI, platformObjectHelper,
			boqColumnFactory, printSettingService, boqHelperService, printConstants,
			commonHelperService, lookupDescriptorService) {

			var serviceContainer = boqColumnFactory.getServiceContainer({
				route: 'procurement/pricecomparison/print/',
				endRead: 'list'
			});
			var service = serviceContainer.service;
			service.load = function () {
				var deferred = $q.defer();
				printSettingService.getCurrentGenericSetting().then(function (genericProfile) {
					printSettingService.getCurrentRfqBoqSetting().then(function (profile) {
						var bidders = platformObjectHelper.getValue(profile, 'bidder.quotes', []),
							baseBidders = platformObjectHelper.getValue(genericProfile, 'bidder', []),
							quoteIds = _.map(bidders, function (item) {
								return item.QtnHeaderFk;
							});

						if (!!baseBidders && !!baseBidders.boq) {
							bidders = commonHelperService.getAllBidders(baseBidders.boq, bidders);
						}

						// set width ang group
						var bidderColumn = {};
						if (genericProfile.column && genericProfile.column.boq) {
							bidderColumn = _.find(genericProfile.column.boq.printColumns, {id: printConstants.bidderFieldName});
						}
						service.MaxBidderNum = _.min([genericProfile.report.bidderPageSize, commonHelperService.getVisibleBidderLength(bidders)]);
						if (bidderColumn) {
							service.BidderWidth = parseInt(bidderColumn.width / service.MaxBidderNum);
						}

						commonHelperService.addBidderMessage(service.MaxBidderNum, service.BidderWidth, bidders);
						// set width readonly if visible is false
						_.forEach(bidders, function (bidder) {
							commonHelperService.setBidderReadonly(bidder);
						});

						commonHelperService.getCompareColumns(2, quoteIds).then(function (result) {
							deferred.resolve({Main: bidders, Quote: result.data.Quotes});
							lookupDescriptorService.updateData('quote', result.data.Quotes);
							var tree = boqHelperService.restructureQuoteCompareColumns(bidders, result.data.Quotes, false);
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

			service.visibleBidderNumChange = function visibleBidderNumChange() {
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
