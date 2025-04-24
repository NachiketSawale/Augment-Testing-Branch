(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.quote';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.quoteStatus = function quoteStatus() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'QuoteStatus',
				valueMember: 'Id',
				displayMember: 'Description',
				imageSelector: 'platformStatusIconService'
			}
		};
	};

	globals.lookups.quoteItemStatus = function quoteItemStatus() {
		return {
			lookupOptions: {
				lookupType: 'QuoteItemStatus',
				valueMember: 'Id',
				displayMember: 'Description',
				imageSelector: 'platformStatusIconService'
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:procurementQuoteStatusCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module(moduleName).directive('procurementQuoteStatusCombobox',['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.quoteStatus().lookupOptions);
		}]);

	/**
	 * @ngdoc directive
	 * @name procurement.requisition.directive:procurementQuoteStatusCombobox
	 * @element div
	 * @restrict A
	 * @description
	 * Strategy combobox.
	 *
	 */
	angular.module(moduleName).directive('procurementQuoteItemStatusCombobox',['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.quoteItemStatus().lookupOptions);
		}]);

})(angular, globals);
