(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.quote';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.quoteType = function quoteType() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'QuoteType',
				valueMember: 'Id',
				displayMember: 'Description'
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.quote.directive:procurementQuoteTypeCombobox
	 * @element div
	 * @restrict A
	 * @description Quote type combobox
	 *
	 */
	angular.module(moduleName).directive('procurementQuoteTypeCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.quoteType().lookupOptions);
		}]);

})(angular, globals);