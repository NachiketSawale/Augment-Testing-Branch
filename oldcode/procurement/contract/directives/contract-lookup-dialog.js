(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	// eslint-disable-next-line no-unused-vars
	globals.lookups.contractLookupView = function contractLookupView($injector) {
		return {
			lookupOptions: {
				version: 3,
				displayMember: 'AddressLine',
				lookupType: 'AddressLookupService',
				valueMember: 'Id',
				uuid: 'b554e83b841c4941a3cb97f4c462f4d9',
				layoutOptions: {
					uiStandardServiceName: 'procurementContractAddressService',
					schemas: [
						{
							typeName: 'BasicsAddressDto',
							moduleSubModule: 'Procurement.Common'
						}
					],
					processColumns: function (columns) {
						return columns;
					}
				},
				title: {name: 'Assign Procurement Contract', name$tr$: 'procurement.contract.contractUpdateInfo'}
			}
		};
	};

	angular.module('procurement.contract').directive('procurementContractLookupDialog', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.contractLookupView($injector).lookupOptions);

		}
	]);

})(angular, globals);