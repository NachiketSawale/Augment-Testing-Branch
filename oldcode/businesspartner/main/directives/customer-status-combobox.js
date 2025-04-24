/**
 * Created by sus on 2014/7/22.
 */

(function (angular, globals) { // jshint ignore:line
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.customerStatus4BusinessParnter = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'customerStatus4BusinessParnter',
				valueMember: 'Id',
				displayMember: 'Description',
				columns: [
					{id: 'desc', field: 'Description', name: 'Description', name$tr$: 'cloud.common.entityDescription'}
				]
			}
		};
	};

	angular.module('businesspartner.main').directive('businessPartnerMainCustomer4BpStatusCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.customerStatus4BusinessParnter().lookupOptions);
		}]);
})(angular, globals);