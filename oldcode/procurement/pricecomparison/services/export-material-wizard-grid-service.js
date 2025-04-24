(function (angular) {

	'use strict';

	var moduleName = 'procurement.pricecomparison';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonExportMaterialWizardGridService
	 * @function
	 * @requires platformDataServiceFactory
	 * @description
	 * #
	 * Data service for wizard 'export material(D94)' dialog grid.
	 */
	angular.module(moduleName).factory('procurementPriceComparisonExportMaterialWizardGridService', [
		'_',
		'platformDataServiceFactory',
		'platformGridDomainService',
		'platformRuntimeDataService',
		'basicsLookupdataLookupDescriptorService',
		'procurementPriceComparisonMainService',
		'basicsLookupdataLookupFilterService',
		'procurementPriceComparisonCheckBidderService',
		'procurementPriceComparisonCommonHelperService',
		function (_,
			platformDataServiceFactory,
			platformGridDomainService,
			platformRuntimeDataService,
			basicsLookupdataLookupDescriptorService,
			procurementPriceComparisonMainService,
			basicsLookupdataLookupFilterService,
			checkBidderService,
			commonHelperService) {
			var serviceOption = {
				module: angular.module(moduleName),
				serviceName: 'procurementPriceComparisonExportMaterialWizardGridService',
				entitySelection: {},
				presenter: {
					tree: {
						parentProp: '',
						childProp: 'Children',
						incorporateDataRead: incorporateDataRead
					}
				},
				httpRead: {
					route: globals.webApiBaseUrl + 'procurement/pricecomparison/comparecolumn/',
					endRead: 'quotes4wizardcreatecontract',
					usePostForRead: true,
					initReadData: function (readData) {
						readData.rfqHeaderFk = procurementPriceComparisonMainService.getIfSelectedIdElse(-1);
						readData.compareType = 3; // (1:Item; 2: Boq; 3: both)
					}
				},
				httpUpdate: {},
				httpCreate: {},
				httpDelete: {},
				isInitialSorted: false
			};
			var service = platformDataServiceFactory.createNewComplete(serviceOption).service;
			basicsLookupdataLookupFilterService.registerFilter([
				{
					key: 'procurement-pricecomparison-quote-version-lookup-filter',
					serverKey: 'procurement-pricecomparison-quote-version-lookup-filter',
					serverSide: true,
					fn: function () {
						// only get the selected quote's rfq's quotes
						var quote = _.find(basicsLookupdataLookupDescriptorService.getData('Quote'), {Id: service.getSelected().QuoteHeaderId});
						if (quote) {
							return {
								RfqHeaderFk: quote.RfqHeaderFk,
								BusinessPartnerFk: quote.BusinessPartnerFk
							};
						} else {
							return {};
						}
					}
				}
			]);

			/**
			 * Status (QTN_STATUS_FK)
			 Code (CODE)
			 Description (DESCRIPTION)
			 Bidder (BPD_BUSINESSPARTNER_FK.BP_NAME1)
			 Grand Total
			 Date Submit (DATE_RECEIVED)
			 Version (VERSION)
			 */
			function incorporateDataRead(readData, data) {
				var reqCounts = readData.QtnReqCount || [],
					totals = readData.Totals || [],
					baseQuotes = [],
					changeQuotes = [];

				// add an formatted date in lookup data
				readData.Quote = readData.Quote.map(function (item) {
					item.DateQuotedFormatted = platformGridDomainService.formatter('date')(0, 0, item.DateQuoted, {});
					return item;
				});

				// distinct by 'QuoteHeaderId' and remove base and target quote
				readData.Main = _.uniq(readData.Main || [], 'QuoteHeaderId')
					.filter(function (item) {
						return checkBidderService.item.isNotReference(parseInt(item.QuoteHeaderId));
					})
					.map(function (item) {

						// add a checkbox, req-count, grand-total column to the data
						item.IsChecked = false;
						item.ReqCount = commonHelperService.getReqCount(reqCounts, item.QuoteHeaderId);
						item.subTotal = commonHelperService.getSubTotal(totals, item.QuoteHeaderId);
						item.grandTotal = commonHelperService.getGrandTotal(readData.Quote, totals, item.BusinessPartnerId, item.QuoteVersion);
						item.Children = []; // is hierarchy now (Base quote has change quotes now)

						return item;
					});

				// rebuild tree
				_.forEach(readData.Main, function (item) {
					if (!item.CompareColumnFk) {
						baseQuotes.push(item);
					} else {
						changeQuotes.push(item);
					}
				});

				_.forEach(baseQuotes, function (base) {
					base.Children = [];
					_.forEach(changeQuotes, function (child) {
						child.Children = [];
						if (child.CompareColumnFk === base.Id) {
							child.ReqCount = commonHelperService.getReqCount(reqCounts, child.QuoteHeaderId);
							child.subTotal = commonHelperService.getSubTotal(totals, child.QuoteHeaderId);
							child.grandTotal = commonHelperService.getGrandTotal(readData.Quote, totals, child.BusinessPartnerId, child.QuoteVersion);
							base.Children.push(child);
						}
					});
				});

				// lookup data
				basicsLookupdataLookupDescriptorService.attachData(readData || {});
				return data.handleReadSucceeded(baseQuotes, data, true);
			}

			return service;
		}
	]);
})(angular);