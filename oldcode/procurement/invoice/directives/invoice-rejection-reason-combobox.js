(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.invRejection = function invRejection() {
		return {
			lookupOptions: {
				lookupType: 'InvRejection',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name invoiceRejectionReasonLookup
	 * @element div
	 * @restrict A
	 * @description
	 * Configuration combobox.
	 *
	 */
	angular.module('procurement.invoice').directive('invoiceRejectionReasonLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.invRejection().lookupOptions);
		}]);

})(angular, globals);