/**
 * Created by baf on 20.11.2020
 */

(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc controller
	 * @name procurementPriceComparisonQuoteByRequestLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  procurement priceComparison quoteByRequest entity.
	 **/
	angular.module(moduleName).service('procurementPriceComparisonQuoteByRequestLayoutService', ProcurementPriceComparisonQuoteByRequestLayoutService);

	ProcurementPriceComparisonQuoteByRequestLayoutService.$inject = ['platformUIConfigInitService', 'procurementPriceComparisonQuoteByRequestUiConfigService',
		'procurementPriceComparisonQuoteByRequestDataService', 'procurementPricecomparisonTranslationService'];

	function ProcurementPriceComparisonQuoteByRequestLayoutService(platformUIConfigInitService, procurementPriceComparisonQuoteByRequestUiConfigService,
		procurementPriceComparisonQuoteByRequestDataService, procurementPricecomparisonTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: procurementPriceComparisonQuoteByRequestUiConfigService.getQuoteByRequestLayout(),
			dtoSchemeId: procurementPriceComparisonQuoteByRequestDataService.getScheme(),
			translator: procurementPricecomparisonTranslationService
		});
	}
})(angular);