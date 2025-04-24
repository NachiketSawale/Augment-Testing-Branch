/**
 * Created by chi on 5/17/2016.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonSeperatePrcItemContractService
	 * @function
	 * @requires platformDataServiceFactory
	 * @description
	 * #
	 * A service for creating contract(s) for the chosen business partner(s) with the chosen procurement item(s).
	 */
	angular.module(moduleName).factory('procurementPriceComparisonSeperatePrcItemContractService', [
		'platformDataServiceFactory', 'basicsLookupdataLookupDescriptorService',
		function (platformDataServiceFactory, basicsLookupdataLookupDescriptorService) {

			var gridData = null;
			var rfqHeaderInfo = {};
			var requestData = {
				seperatePrcItemsGrouppedByBP: [],
				wizards: null
			};

			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementPriceComparisonSeperatePrcItemContractService',
				entitySelection: {},
				presenter: {
					list: {}
				},
				httpRead: {
					useLocalResource: true,
					resourceFunction: getData
				},
				httpUpdate: {},
				httpCreate: {},
				httpDelete: {},
				isInitialSorted: false
			};
			var service = platformDataServiceFactory.createNewComplete(serviceOption).service;

			service.responseData = responseData;
			service.getRfqHeaderInfo = getRfqHeaderInfo;
			service.getRequestData = getRequestData;
			service.resetData = resetData;

			function responseData(dataList, rfqHeader, from) {
				rfqHeaderInfo = rfqHeader;
				requestData.wizards = from;

				if (angular.isDefined(rfqHeaderInfo.ProjectFk) && rfqHeaderInfo.ProjectFk !== null) {
					var projects = basicsLookupdataLookupDescriptorService.getData('Project');
					if (projects && projects[rfqHeaderInfo.ProjectFk]) {
						rfqHeaderInfo.ProjectCode = projects[rfqHeaderInfo.ProjectFk].ProjectNo;
						rfqHeaderInfo.ProjectDescription = projects[rfqHeaderInfo.ProjectFk].ProjectName;
					}
				}

				var grouppedList = [];
				if (dataList) {
					_.forEach(dataList, function (data) {
						var quotes = basicsLookupdataLookupDescriptorService.getData('Quote');
						if (quotes && quotes[data.quoteId]) {
							var quote = quotes[data.quoteId];
							var found = _.find(grouppedList, {Id: quote.BusinessPartnerFk});
							if (found) {
								found.total += data.total;
								found.quantity += data.quantity;
							} else {
								var gridItem = {
									Id: quote.BusinessPartnerFk,
									total: data.total,
									quantity: data.quantity,
									businessPartnerName1: quote.BusinessPartnerName1
								};
								grouppedList.push(gridItem);
							}

							var foundBP = _.find(requestData.seperatePrcItemsGrouppedByBP, {BusinessPartnerId: quote.BusinessPartnerFk});

							var prcHeaderInfo = null;
							if (foundBP) {
								var foundPrcHeader = _.find(foundBP.RelatedPrcHeaders, {PrcHeaderId: data.qtnReqPrcHeaderId});
								if (foundPrcHeader) {
									foundPrcHeader.PrcItemIds.push(data.qtnPrcItemId);
								}
								else {
									prcHeaderInfo = {
										QuoteHeaderId: quote.Id,
										PrcHeaderId: data.qtnReqPrcHeaderId,
										PrcItemIds: [data.qtnPrcItemId]
									};
									foundBP.RelatedPrcHeaders.push(prcHeaderInfo);
								}
							} else {
								prcHeaderInfo = {
									QuoteHeaderId: quote.Id,
									PrcHeaderId: data.qtnReqPrcHeaderId,
									PrcItemIds: [data.qtnPrcItemId]
								};
								var seperatePrcItemGrouppedByBP = {
									BusinessPartnerId: quote.BusinessPartnerFk,
									RelatedPrcHeaders: [prcHeaderInfo]
								};
								requestData.seperatePrcItemsGrouppedByBP.push(seperatePrcItemGrouppedByBP);
							}
						}
					});
				}
				gridData = grouppedList;
			}

			function getData() {
				return gridData;
			}

			function getRfqHeaderInfo() {
				return rfqHeaderInfo;
			}

			function getRequestData() {
				return requestData;
			}

			function resetData() {
				gridData = null;
				rfqHeaderInfo = {};
				requestData = {
					seperatePrcItemsGrouppedByBP: [],
					wizards: null
				};
			}

			return service;
		}
	]);
})(angular);