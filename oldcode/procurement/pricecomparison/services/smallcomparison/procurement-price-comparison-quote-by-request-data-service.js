/**
 * Created by baf on 20.11.2020
 */

// eslint-disable-next-line no-redeclare
/* global angular,globals,_ */
(function (angular) {
	'use strict';
	var myModule = angular.module('procurement.pricecomparison');

	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonQuoteByRequestDataService
	 * @description pprovides methods to access, create and update procurement priceComparison quoteByRequest entities
	 */
	myModule.service('procurementPriceComparisonQuoteByRequestDataService', ProcurementPriceComparisonQuoteByRequestDataService);

	ProcurementPriceComparisonQuoteByRequestDataService.$inject = ['platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'basicsCommonMandatoryProcessor', 'procurementPriceComparisonMainService'];

	function ProcurementPriceComparisonQuoteByRequestDataService(platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
		basicsCommonMandatoryProcessor, procurementPriceComparisonMainService) {
		var quoteByRequestScheme = {typeName: 'Quote2RfqVDto', moduleSubModule: 'Procurement.PriceComparison'};
		var self = this;
		var procurementPriceComparisonQuoteByRequestServiceOption = {
			flatLeafItem: {
				module: myModule,
				serviceName: 'procurementPriceComparisonQuoteByRequestDataService',
				entityNameTranslationID: 'procurement.priceComparison.quoteByRequestEntity',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'procurement/pricecomparison/quote2rfq/',
					endRead: 'listbyrfqheader',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						var selected = procurementPriceComparisonMainService.getSelected();
						readData.PKey1 = selected.Id;
					}
				},
				actions: {delete: false, create: false},
				dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor(
					quoteByRequestScheme)],
				presenter: {
					list: {
						initCreationData: function initCreationData(creationData) {
							var selected = procurementPriceComparisonMainService.getSelected();
							creationData.PKey1 = selected.Id;
						}
					}
				},
				entityRole: {
					leaf: {itemName: 'QuoteByRequest', parentService: procurementPriceComparisonMainService}
				}
			}
		};

		var serviceContainer = platformDataServiceFactory.createService(procurementPriceComparisonQuoteByRequestServiceOption, self);
		serviceContainer.data.Initialised = true;
		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({
			mustValidateFields: true,
			validationService: 'procurementPriceComparisonQuoteByRequestValidationService'
		}, quoteByRequestScheme));

		serviceContainer.service.getScheme = function getScheme() {
			return quoteByRequestScheme;
		};
	}
})(angular);
