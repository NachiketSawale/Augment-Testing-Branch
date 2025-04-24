(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,console */
	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonItemColumnValidationService
	 */
	angular.module(moduleName).factory('procurementPriceComparisonItemColumnValidationService', [
		'basicsLookupdataLookupDescriptorService',
		function (basicsLookupdataLookupDescriptorService) {

			function createValidator(dataService) {
				return {

					// paras: currentItem, value, field
					validateQtnHeaderFk: function (currentItem, value) {
						try {
							// once the bp is changed, the description text is also changed by default
							currentItem.DescriptionInfo.Description = basicsLookupdataLookupDescriptorService.getLookupItem('Quote', value).BusinessPartnerName1 || '';

							dataService.gridRefresh();
						} catch (e) {
							console.warn(e.message);
						}
					}
				};
			}


			return createValidator;
		}
	]);
})(angular);
