// eslint-disable-next-line no-redeclare
/* global angular,globals */

(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.stock';

	globals.lookups.stockAccountingType = function stockAccountingType() {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'StockAccountingType',
				valueMember: 'Id',
				displayMember: 'Description'
			}
		};
	};

	angular.module(moduleName).directive( 'procurementStockStockaccountingtypeDialog', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.stockAccountingType().lookupOptions);
		}
	]);
})(angular, globals);
