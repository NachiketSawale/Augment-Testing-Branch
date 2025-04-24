// eslint-disable-next-line no-redeclare
/* global angular,globals */

(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.stock';

	globals.lookups.projectStock2ProjectStockLocation = function projectStock2ProjectStockLocation() {
		return {
			lookupOptions: {
				lookupType: 'ProjectStock2ProjectStockLocation',
				valueMember: 'Id',
				displayMember: 'Code',
				columns: [
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						width: 100,
						name$tr$: 'cloud.common.entityStockLocationCode'
					},
					{
						id: 'decription',
						field: 'DescriptionInfo.Description',
						name: 'StockLocation Description',
						width: 120,
						name$tr$: 'procurement.stock.transaction.stocklocationDescription'
					}
				]
			}
		};
	};

	angular.module(moduleName).directive( 'procurementStockLocationDialog', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.projectStock2ProjectStockLocation().lookupOptions);
		}
	]);
})(angular, globals);
