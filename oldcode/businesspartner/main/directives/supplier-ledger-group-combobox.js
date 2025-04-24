(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.supplierLedgerGroup = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'SupplierLedgerGroup',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated'
			}
		};
	};

	/**
	 * @ngdoc directive
	 * @name Basics.LookupData.directive:cloudLookupSupplierLedgerGroupCombobox
	 * @element
	 * @restrict
	 * @priority
	 * @scope
	 * @description
	 * #
	 * a combobox directive for Supplier Ledger Group
	 *
	 */
	angular.module('businesspartner.main').directive('businessPartnerMainSupplierLedgerGroupCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.supplierLedgerGroup().lookupOptions);
		}
	]);

})(angular, globals);