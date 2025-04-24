/**
 * Created by wwa on 11/8/2016.
 */
( function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.contract';

	globals.lookups.purchaseOrders = function purchaseOrders() {
		return {
			lookupOptions: {
				lookupType: 'PurchaseOrders',
				valueMember: 'Id',
				displayMember: 'Description'
			},
			dataProvider: 'contractHeaderPurchaseOrdersDataService'
		};
	};

	angular.module(moduleName).directive('contractHeaderPurchaseOrdersCombobox', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			var defaults = globals.lookups.purchaseOrders();
			return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults.lookupOptions, {
				dataProvider: defaults.dataProvider
			});
		}
	]);
})(angular, globals);