// eslint-disable-next-line no-redeclare
/* global angular,globals */

(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.stock';

	angular.module(moduleName).directive( 'procurementStockInv2ContractDialog', [
		'BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = angular.copy(globals.lookups.invHeaderChained().lookupOptions);
			defaults.columns = [
				{
					id: 'id',
					field: 'Id',
					name: 'Id',
					width: 100,
					name$tr$: 'cloud.common.entityInvHeaderId'
				},
				{
					id: 'code',
					field: 'Code',
					name: 'Code',
					width: 100,
					name$tr$: 'cloud.common.entityInvHeaderCode'
				},
				{
					id: 'desc',
					field: 'Description',
					name: 'Description',
					width: 150,
					name$tr$: 'cloud.common.entityDescription'
				}
			];
			defaults.width = 500;
			defaults.height = 200;
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', defaults);
		}
	]);
})(angular, globals);