/**
 * Created by wuj on 5/29/2015.
 */
( function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.invHeaderChained = function invHeaderChained() {
		return {
			lookupOptions: {
				version:3,
				lookupType: 'InvHeaderChained',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: '47727c138dc24add9d555718c073aa57',
				columns: [ {
					id: 'code',
					field: 'Code',
					name: 'Entry No',
					width: 80,
					name$tr$: 'procurement.invoice.header.code'
				}, {
					id: 'desc',
					field: 'Description',
					name: 'Narrative',
					width: 150,
					name$tr$: 'procurement.invoice.header.description'
				},
				{
					id: 'status',
					field: 'InvStatusFk',
					name: 'Status',
					name$tr$: 'cloud.common.entityStatus',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'InvStatus',
						displayMember: 'DescriptionInfo.Translated',
						imageSelector: 'platformStatusIconService'
					},
					width: 100,
					searchable:false
				},{
					id: 'date',
					field: 'DateInvoiced',
					name: 'Date',
					width: 80,
					name$tr$: 'procurement.invoice.header.dateInvoiced',
					formatter: 'date'
				}, {
					id: 'reference',
					field: 'Reference',
					name: 'Reference',
					width: 100,
					name$tr$: 'procurement.invoice.header.reference'
				}, {
					id: 'dateReceived',
					field: 'DateReceived',
					name: 'Received',
					width: 80,
					name$tr$: 'procurement.invoice.header.dateReceived',
					formatter: 'date'
				}, {
					id: 'type',
					field: 'TypeDescriptionInfo.Translated',
					name: 'Type',
					width: 80,
					name$tr$: 'cloud.common.entityType',
					searchable:false
				}, {
					id: 'netTotal',
					field: 'NetTotal',
					name: 'Net Total',
					width: 80,
					name$tr$: 'procurement.invoice.header.netTotal',
					formatter: 'money',
					searchable:false
				}, {
					id: 'period',
					field: 'Period',
					name: 'Period',
					width: 80,
					name$tr$: 'procurement.invoice.header.period',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'netTotalOc',
					field: 'NetTotalOc',
					name: 'NetTotalOc',
					width: 80,
					name$tr$: 'procurement.invoice.header.netTotalOc',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'periodOc',
					field: 'PeriodOc',
					name: 'PeriodOc',
					width: 80,
					name$tr$: 'procurement.invoice.header.periodOc',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'amountNetPes',
					field: 'AmountNetPes',
					name: 'AmountNetPes',
					width: 80,
					name$tr$: 'procurement.invoice.header.amountNetPES',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'amountNetPesOc',
					field: 'AmountNetPesOc',
					name: 'AmountNetPesOc',
					width: 80,
					name$tr$: 'procurement.invoice.header.amountNetPESOc',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'amountVatPes',
					field: 'AmountVatPes',
					name: 'AmountVatPes',
					width: 80,
					name$tr$: 'procurement.invoice.header.amountVatPES',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'amountVatPesOc',
					field: 'AmountVatPesOc',
					name: 'AmountVatPesOc',
					width: 80,
					name$tr$: 'procurement.invoice.header.amountVatPESOc',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'amountNetContract',
					field: 'AmountNetContract',
					name: 'AmountNetContract',
					width: 80,
					name$tr$: 'procurement.invoice.header.amountNetContract',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'amountNetContractOc',
					field: 'AmountNetContractOc',
					name: 'AmountNetContractOc',
					width: 80,
					name$tr$: 'procurement.invoice.header.amountNetContractOc',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'amountVatContract',
					field: 'AmountVatContract',
					name: 'AmountVatContract',
					width: 80,
					name$tr$: 'procurement.invoice.header.amountVatContract',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'amountVatContractOc',
					field: 'AmountVatContractOc',
					name: 'AmountVatContractOc',
					width: 80,
					name$tr$: 'procurement.invoice.header.amountVatContractOc',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'amountNetOther',
					field: 'AmountNetOther',
					name: 'AmountNetOther',
					width: 80,
					name$tr$: 'procurement.invoice.header.amountNetOther',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'amountNetOtherOc',
					field: 'AmountNetOtherOc',
					name: 'AmountNetOtherOc',
					width: 80,
					name$tr$: 'procurement.invoice.header.amountNetOtherOc',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'amountVatOther',
					field: 'AmountVatOther',
					name: 'AmountVatOther',
					width: 80,
					name$tr$: 'procurement.invoice.header.amountVatOther',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'amountVatOtherOc',
					field: 'AmountVatOtherOc',
					name: 'AmountVatOtherOc',
					width: 80,
					name$tr$: 'procurement.invoice.header.amountVatOtherOc',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'amountNetReject',
					field: 'AmountNetReject',
					name: 'AmountNetReject',
					width: 80,
					name$tr$: 'procurement.invoice.header.amountNetReject',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'amountNetRejectOc',
					field: 'AmountNetRejectOc',
					name: 'AmountNetRejectOc',
					width: 80,
					name$tr$: 'procurement.invoice.header.amountNetRejectOc',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'amountVatReject',
					field: 'AmountVatReject',
					name: 'AmountVatReject',
					width: 80,
					name$tr$: 'procurement.invoice.header.amountVatReject',
					formatter: 'money',
					searchable:false
				},
				{
					id: 'amountVatRejectOc',
					field: 'AmountVatRejectOc',
					name: 'AmountVatRejectOc',
					width: 80,
					name$tr$: 'procurement.invoice.header.amountVatRejectOc',
					formatter: 'money',
					searchable:false
				}
				],
				width: 1000,
				height: 800,
				title: {name: 'Invoice Search Dialog', name$tr$: 'procurement.invoice.invoiceDialogTitle'}
			}
		};
	};

	angular.module('procurement.invoice').directive('procurementInvoiceHeaderDialog', ['BasicsLookupdataLookupDirectiveDefinition',
		function (BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.invHeaderChained().lookupOptions);
		}
	]);

})(angular, globals);
