// eslint-disable-next-line func-names
// eslint-disable-next-line no-redeclare
/* global angular,globals */

(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.stock';

	globals.lookups.clerk = function clerk() {
		return {
			lookupOptions: {
				lookupType: 'Clerk',
				valueMember: 'Id',
				displayMember: 'Code',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'BasClerk Code',
						width: 100,
						name$tr$: 'cloud.common.entityBasClerkCode'
					},
					{
						id: 'decription',
						field: 'Description',
						name: 'BasClerk Description',
						width: 120,
						name$tr$: 'cloud.common.entityBasClerkDec'
					}
				]
			}
		};
	};

	angular.module(moduleName).directive( 'procurementStockClerkDialog', [
		'BasicsLookupdataLookupDirectiveDefinition',
		// eslint-disable-next-line func-names
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.clerk().lookupOptions);
		}
	]);
})(angular, globals);
