( function (angular, globals) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals */
	globals.lookups.invoicePes = function invoicePes($injector) {
		var ServiceDataProcessDatesExtension = $injector.get('ServiceDataProcessDatesExtension');
		return {
			lookupOptions: {
				version:2,
				lookupType: 'InvoicePes',
				valueMember: 'Id',
				displayMember: 'Code',
				uuid: 'b295d7a52fae4ceda963ffecc43e9189',
				columns: [
					{id: 'code', field: 'Code', name: 'Code', width: 100, name$tr$: 'cloud.common.entityCode'},
					{
						id: 'desc',
						field: 'Description',
						name: 'Description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'status',
						field: 'StatusDescriptionInfo.Translated',
						name: 'Status',
						width: 100,
						name$tr$: 'cloud.common.entityStatus',
						formatter: function (row, cell, value, columnDef, dataContext) {
							dataContext.icon=dataContext.StatusIcon;
							var imageSelector = $injector.get('platformStatusIconService');
							var imageUrl = imageSelector.select(dataContext);
							var isCss = Object.prototype.hasOwnProperty.call(imageSelector,'isCss') ? imageSelector.isCss() : false;
							return (isCss ? '<i class="block-image ' + imageUrl + '"></i>' : '<img src="' + imageUrl + '">') +
								'<span class="pane-r">' + value + '</span>';
						},

						searchable: false

					},
					{
						id: 'documentDate',
						field: 'DocumentDate',
						name: 'Document Date',
						width: 100,
						name$tr$: 'procurement.invoice.entityDocumentDate',
						formatter: 'date',
						searchable: false
					},
					{
						id: 'conCode',
						field: 'ConCode',
						name: 'Contract',
						width: 100,
						name$tr$: 'procurement.invoice.entityConCode'
					},
					{
						id: 'ctrlCode',
						field: 'ControllingUnitCode',
						name: 'Controlling Unit',
						width: 150,
						name$tr$: 'procurement.invoice.entityCtrlCode',
						searchable: false
					},
					{
						id: 'bpdName1',
						field: 'BpName1',
						name: 'Business Partner',
						width: 150,
						name$tr$: 'cloud.common.entityBusinessPartner'
					},
					{
						id: 'supplier',
						field: 'SupplierCode',
						name: 'Supplier',
						width: 150,
						name$tr$: 'cloud.common.entitySupplier'
					},{
						id: 'prcStructureCode',
						field: 'PrcStructureCode',
						name: 'Structure Code',
						width: 120,
						name$tr$: 'cloud.common.entityStructureCode',
						searchable: false
					},{
						id: 'prcStructureDesc',
						field: 'PrcStructureDescriptionInfo.Translated',
						name: 'Structure Description',
						width: 150,
						name$tr$: 'cloud.common.entityStructureDescription',
						searchable: false
					},{
						id: 'pesValue',
						field: 'PesValue',
						name: 'value',
						width: 80,
						name$tr$: 'procurement.invoice.entityOriginalValue',
						formatter:'money'
					},{
						id: 'pesVat',
						field: 'PesVat',
						name: 'VAT',
						width: 80,
						name$tr$: 'procurement.invoice.entityOriginalVAT',
						formatter:'money'
					},{
						id: 'pesValueOc',
						field: 'PesValueOc',
						name: 'Value(OC)',
						width: 80,
						name$tr$: 'procurement.invoice.entityOriginalValueOc',
						formatter:'money'
					},{
						id: 'pesVatOc',
						field: 'PesVatOc',
						name: 'VAT(OC)',
						width: 80,
						name$tr$: 'procurement.invoice.entityOriginalVATOc',
						formatter:'money'
					}
				],
				width: 500,
				height: 200,
				title: { name: 'Performance Entry Sheet Search Dialog', name$tr$: 'procurement.invoice.pesLookupDialogTitle' },
				dataProcessors: [$injector.get('platformDataServiceProcessDatesBySchemeExtension').createProcessor({
					typeName: 'InvPeslookupVDto',
					moduleSubModule: 'Procurement.Invoice'
				}),new ServiceDataProcessDatesExtension(['DocumentDate', 'DateDelivered', 'DateDeliveredfrom'])]
			}
		};
	};

	angular.module('procurement.invoice').directive('procurementInvoicePesLookup', ['$injector', 'BasicsLookupdataLookupDirectiveDefinition',
		function ($injector, BasicsLookupdataLookupDirectiveDefinition) {
			return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', globals.lookups.invoicePes($injector).lookupOptions);
		}
	]);

})(angular, globals);