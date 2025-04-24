// eslint-disable-next-line no-redeclare
/* global angular,globals */
(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.stock';

	globals.lookups.stockTransactionType = function stockTransactionType() {
		return {
			lookupOptions: {
				version: 3,
				lookupType: 'StockTransactionType',
				valueMember: 'Id',
				displayMember: 'DescriptionInfo.Translated',
				imageSelector: 'basicsCustomizeProcurementStockTransactionTypeIconService'
				// columns: [
				//     {
				//         id: 'DescriptionInfo',
				//         field: 'DescriptionInfo',
				//         name: 'DescriptionInfo',
				//         width: 120,
				//         name$tr$: 'cloud.common.entityStockTransactionTypeDec'
				//     },
				// ],
			}
		};
	};

	angular.module(moduleName).directive( 'procurementStockTransactionTypeDialog', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', globals.lookups.stockTransactionType().lookupOptions);
		}
	]);
})(angular, globals);
