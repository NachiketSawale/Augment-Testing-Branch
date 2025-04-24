/**
 * Created by wui on 9/27/2018.
 */

(function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	var moduleName = 'procurement.invoice';

	globals.lookups.invRejectLookupV = function invRejectLookupV($injector) {
		return {
			lookupOptions: {
				lookupType: 'InvRejectLookupV',
				valueMember: 'Id',
				displayMember: 'Description',
				uuid: '63484025580b43c899d6a9422ffba029',
				columns: [
					{id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode'},
					{id: 'desc', field: 'Description', name: 'Description', width: 150, name$tr$: 'cloud.common.entityDescription'},
					{id: 'invRejectionReason', field: 'InvRejectionReason', name: 'Rejection Reason', width: 100, name$tr$: 'procurement.invoice.entityRejection'},
					{id: 'amountNetTotal', field: 'AmountNetTotal', name: 'Amount(Net)', width: 80, name$tr$: 'procurement.invoice.header.amountNet', formatter:'money'},
					{id: 'amountNetTotalOc', field: 'AmountNetTotalOc', name: 'Amount(Net OC)', width: 80, name$tr$: 'procurement.invoice.header.amountNetOC', formatter:'money'},
					{id: 'dateInvoiced', field: 'DateInvoiced', name: 'DateInvoiced', width: 80, name$tr$: 'procurement.invoice.header.dateInvoiced',formatter: 'date'},
					{id: 'dateReceived', field: 'DateReceived', name: 'DateReceived', width: 80, name$tr$: 'procurement.invoice.header.dateReceived',formatter: 'date'},
					{id: 'reference', field: 'Reference', name: 'Reference', width: 80, name$tr$: 'procurement.invoice.header.reference'},

				],
				disableDataCaching: true,
				dataProcessor: {
					execute: function (data) {
						var procurementInvoiceRejectionDataService = $injector.get('procurementInvoiceRejectionDataService');
						var list = procurementInvoiceRejectionDataService.getList();

						return data.filter(function (item) {
							return !(list.some(function (listItem) {
								return listItem.InvRejectFk === item.Id;
							}));
						});
					}
				}
			}
		};
	};

	angular.module(moduleName).directive('procurementInvoiceRejectionVLookup', ['BasicsLookupdataLookupDirectiveDefinition', '$injector',
		function (BasicsLookupdataLookupDirectiveDefinition, $injector) {
			return new BasicsLookupdataLookupDirectiveDefinition('lookup-edit', globals.lookups.invRejectLookupV($injector).lookupOptions);
		}
	]);

})(angular, globals);