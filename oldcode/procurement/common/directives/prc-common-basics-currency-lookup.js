(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.common';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	globals.lookups.basCurrencyLookup = function basCurrencyLookup() {
		return {
			lookupOptions: {
				version: 2,
				lookupType: 'basCurrency',
				valueMember: 'Id',
				displayMember: 'Currency',
				uuid: '294052ab240f44a5bc28e300732aed57',
				columns: [
					{
						id: 'Currency',
						field: 'Currency',
						name: 'Currency',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCurrency'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo.Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription'
					}
				]
			}
		};
	};

	angular.module(moduleName).directive('prcCommonBasicsCurrencyLookup', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.basCurrencyLookup().lookupOptions);
		}]);

})(angular, globals);