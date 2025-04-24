// eslint-disable-next-line no-redeclare
/* global angular,globals */

(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.stock';

	globals.lookups.stockValuationRule = function stockValuationRule() {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'StockValuationRule',
				valueMember: 'Id',
				displayMember: 'Description'
			}
		};
	};

	angular.module(moduleName).directive( 'procurementStockStockvaluationruleDialog', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.stockValuationRule().lookupOptions);
		}
	]);



	angular.module(moduleName).directive( 'procurementStockStockvaluationruleCombobox', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.stockValuationRule().lookupOptions);
		}
	]);


})(angular, globals);
