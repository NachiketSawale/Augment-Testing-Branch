(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonItemColumnService
	 * @function
	 * @requires procurementPriceComparisonMainService
	 * @description
	 * data service of rfq item comparison compare column controller
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('procurementPriceComparisonItemColumnService', [
		'platformDataServiceFactory', 'procurementPriceComparisonMainService', 'platformModalService', '$translate', 'platformDataServiceSelectionExtension',
		'procurementPriceComparisonCommonService', 'platformRuntimeDataService', 'platformGridAPI', 'basicsLookupdataLookupDescriptorService', 'procurementPriceComparisonItemHelperService', 'procurementPriceComparisonItemColumnFactory',
		function (platformDataServiceFactory, procurementPriceComparisonMainService, platformModalService, $translate, platformDataServiceSelectionExtension,
			commonService, platformRuntimeDataService, platformGridAPI, basicsLookupdataLookupDescriptorService, itemHelperService, itemColumnFactory) {

			var serviceContainer = itemColumnFactory.getServiceContainer({
				route: 'procurement/pricecomparison/comparecolumn/',
				endRead: 'columnlist'
			});

			return serviceContainer.service;
		}
	]);
})(angular);
