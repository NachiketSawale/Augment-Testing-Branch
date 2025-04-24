(function (angular, globals) { // jshint ignore:line
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.customerBranch = function () {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'customerbranch',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '17e61ddb8c884dd1ba816fdc36b6f4aa',
				columns: [
					{id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode'},
					{id: 'desc', field: 'Description', name: 'Description', width: 150, name$tr$: 'cloud.common.entityDescription'}
				]
			}
		};
	};

	angular.module('businesspartner.main').directive('businessPartnerMainCustomerBranchLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.customerBranch().lookupOptions);
		}]);
})(angular, globals);