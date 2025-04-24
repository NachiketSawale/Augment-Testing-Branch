(function (angular) {
	'use strict';

	var moduleName = 'procurement.pricecomparison';

	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonBoqColumnService
	 * @function
	 * @requires procurementPriceComparisonMainService
	 *
	 * @description
	 * #
	 * data service of price comparison boq compare column controller
	 */
	/* jshint -W072 */
	angular.module(moduleName).factory('procurementPriceComparisonBoqColumnService', [
		'platformDataServiceFactory', 'procurementPriceComparisonMainService', 'basicsLookupdataLookupDescriptorService', 'platformModalService',
		'platformDataServiceSelectionExtension', '$translate', 'platformGridAPI', 'platformRuntimeDataService', 'procurementPriceComparisonCommonService',
		'procurementPriceComparisonBoqHelperService', 'procurementPriceComparisonBoqColumnFactory',
		function (platformDataServiceFactory, mainDataService, basicsLookupdataLookupDescriptorService, platformModalService,
			platformDataServiceSelectionExtension, $translate, platformGridAPI, platformRuntimeDataService, commonService, boqHelperService, boqColumnFactory) {

			var serviceContainer = boqColumnFactory.getServiceContainer({
				route: 'procurement/pricecomparison/comparecolumn/',
				endRead: 'columnlist'
			});

			return serviceContainer.service;
		}
	]);
})(angular);
