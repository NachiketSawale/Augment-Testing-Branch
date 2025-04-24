// eslint-disable-next-line no-redeclare
/* global angular,globals */

(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.stock';

	globals.lookups.projectStock = function projectStock() {
		return {
			lookupOptions: {
				lookupType: 'ProjectStock',
				valueMember: 'Id',
				displayMember: 'Code',
				columns: [
					{id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode'},
					{id: 'desc',field: 'Description', name: 'Stock Description', width: 120, name$tr$: 'cloud.common.entityStockDescription'}
				],
				uuid:'0abbfe65f1d448099b50fbf0a4158452'
			}
		};
	};

	angular.module(moduleName).directive( 'procurementStockLookupDialog', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.projectStock().lookupOptions);
		}
	]);
})(angular, globals);
