/**
 * Created by baf on 20.11.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonQuoteByRequestValidationService
	 * @description provides validation methods for procurement priceComparison quoteByRequest entities
	 */
	angular.module(moduleName).service('procurementPriceComparisonQuoteByRequestValidationService', ProcurementPriceComparisonQuoteByRequestValidationService);

	ProcurementPriceComparisonQuoteByRequestValidationService.$inject = ['platformValidationServiceFactory', 'procurementPriceComparisonQuoteByRequestDataService'];

	function ProcurementPriceComparisonQuoteByRequestValidationService(platformValidationServiceFactory, procurementPriceComparisonQuoteByRequestDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(procurementPriceComparisonQuoteByRequestDataService.getScheme(), {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(procurementPriceComparisonQuoteByRequestDataService.getScheme())
		},
		self,
		procurementPriceComparisonQuoteByRequestDataService);
	}
})(angular);
