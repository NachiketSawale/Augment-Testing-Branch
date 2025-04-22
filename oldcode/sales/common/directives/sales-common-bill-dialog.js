/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';


	angular.module('sales.common').directive('salesCommonBillDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {

			var defaults = {
				lookupType: 'SalesBilling',
				valueMember: 'Id',
				displayMember: 'BillNo',
				uuid: '258A0F3BAB5A427ABEE4E5949C228C61',
				columns: [
					{ id: 'BillNo', field: 'BillNo', name: 'BillNo', width: 180, formatter: 'code', name$tr$: 'sales.billing.entityBillNo' },
					{ id: 'Description', field: 'DescriptionInfo', name: 'Description', width: 300, formatter: 'translation',  name$tr$: 'cloud.common.entityDescription' }
					// TODO:
					// more columns...?
				],
				title: { name: 'Assign A Bill', name$tr$: 'sales.common.dialogTitleAssignBill' }
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);

	// new version which will replace the old one above
	// we need to step by step migrate all usages of the lookup
	angular.module('sales.common').directive('salesCommonBillDialogV2', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			let defaults = {
				version: 2,
				lookupType: 'SalesBillingV2',
				valueMember: 'Id',
				displayMember: 'BillNo',
				uuid: '0d39249367da4e79a5faca8834699e9b',
				columns: [
					{ id: 'BillNo', field: 'BillNo', name: 'BillNo', width: 180, formatter: 'code', name$tr$: 'sales.billing.entityBillNo' },
					{ id: 'Description', field: 'DescriptionInfo', name: 'Description', width: 300, formatter: 'translation',  name$tr$: 'cloud.common.entityDescription' }
				],
				title: { name: 'Assign A Bill', name$tr$: 'sales.common.dialogTitleAssignBill' }
			};

			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
		}
	]);
})();
