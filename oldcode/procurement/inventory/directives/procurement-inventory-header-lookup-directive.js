/**
 * Created by lcn on 3/9/2020.
 */

// eslint-disable-next-line no-redeclare
/* global angular,globals */
(function(angular, globals){

	'use strict';
	var moduleName = 'procurement.inventory';

	globals.lookups.InventoryHeader = function () {
		return {
			lookupOptions: {
				version: 2,
				lookupType: 'InventoryHeader',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid: '7e3a0337d24b487baa4b39541cd60fe1',
				columns: [
					{
						id: 'desc',
						field: 'Description',
						name: 'Description',
						width: 240,
						toolTip: 'Description',
						formatter: 'description',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				title: {name: 'InventoryHeader Header'}
			}
		};
	};


	angular.module(moduleName).directive('procurementInventoryHeaderLookup', procurementInventoryHeaderLookupDirective);

	procurementInventoryHeaderLookupDirective.$inject = ['globals','BasicsLookupdataLookupDirectiveDefinition'];

	function  procurementInventoryHeaderLookupDirective(globals,BasicsLookupdataLookupDirectiveDefinition) {
		var providerInfo = globals.lookups.InventoryHeader();
		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', providerInfo.lookupOptions);
	}

})(angular, globals);