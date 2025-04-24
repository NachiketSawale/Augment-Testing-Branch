(function (angular) {
	'use strict';
	var moduleName = 'procurement.pricecomparison';
	// eslint-disable-next-line no-redeclare
	/* global angular,console */
	/**
	 * @ngdoc service
	 * @name procurementPriceComparisonBoqColumnValidationService
	 */
	angular.module(moduleName).factory('procurementPriceComparisonBoqColumnValidationService', [
		'basicsLookupdataLookupDescriptorService',
		function (basicsLookupdataLookupDescriptorService) {

			function createValidator(dataService) {
				return {
					// paras: currentItem, value, field
					validateQtnHeaderFk: function (currentItem, value) {
						try {
							// once the bp is changed, the description text is also changed by default
							currentItem.DescriptionInfo.Translated = basicsLookupdataLookupDescriptorService.getLookupItem('Quote', value).BusinessPartnerName1 || '';
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
