/**
 * Created by lcn on 20/12/2024.
 */

(function (angular) {
	'use strict';

	const moduleName = 'sales.billing';

	angular.module(moduleName).service('salesBillingInterCompanyDrillDownService', [
		'_',
		'procurementCommonInterCompanyDrillDownFactoryService',
		'basicsLookupdataLookupDescriptorService',
		function (_, factoryService, LookupdataLookupDescriptorService) {

			const translateSource = 'sales.billing.wizard.createInterCompanyInvoice.';
			const commonTranslate = 'procurement.common.wizard.createInterCompany.';

			// Helper function for creating columns
			const createColumn = (id, field, width, translatePrefix, type, lookupType = '', lookupField = '') =>
				factoryService.createColumn(id, field, width, translatePrefix, type, lookupType, lookupField);

			// Helper function to retrieve nested property from an object
			const getNestedProperty = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

			const createCompositeColumn = (id, field, width, lookupField, isCustomerSupplier = true, lookupField2 = '') => ({
				id,
				field,
				width,
				name$tr$: `${translateSource}${id}`,
				formatter: (row, cell, value, columnDef, entity) => {
					const dataKey = isCustomerSupplier
						? (entity.CustomerId ? 'Customer' : (entity.SupplierId ? 'Supplier' : ''))
						: (entity.InvHeaderId ? 'InvHeaderChained' : (entity.BillId ? 'SalesBilling' : ''));

					if (dataKey) {
						const lookupId = entity[`${dataKey}Id`] || entity[`${dataKey === 'SalesBilling' ? 'BillId' : 'InvHeaderId'}`];
						const item = _.find(LookupdataLookupDescriptorService.getData(dataKey), {Id: lookupId});
						return item ? getNestedProperty(item, lookupField) || getNestedProperty(item, lookupField2) : value;
					}

					return value;
				},
				readonly: true
			});

			// Columns configuration
			const columns = [
				createCompositeColumn('customerSupplierCode', 'CustomerId', 150, 'Code', true),
				createCompositeColumn('customerSupplierName', 'CustomerId', 150, 'Description', true),
				createCompositeColumn('billInvoiceNo', 'BillId', 140, 'Code', false),
				createColumn('invoiceDate', 'InvoiceDate', 80, commonTranslate, 'date'),
				createColumn('postDate', 'PostDate', 80, commonTranslate, 'date'),
				createCompositeColumn('billInvoiceNoDesc', 'BillId', 150, 'Description', false, 'DescriptionInfo.Translated'),
				createColumn('billedAmount', 'BilledAmount', 110, commonTranslate, 'money'),
				createColumn('surchargeAmount', 'SurchargeAmount', 102, commonTranslate, 'money'),
				createColumn('totalAmount', 'TotalAmount', 82, commonTranslate, 'money')
			];

			// Tree options configuration
			const treeOptions = {
				parentProp: 'BillId',
				childProp: 'ChildItems',
				initialState: 'expanded'
			};

			// Service configuration
			const config = {
				gridId: '3aa40060b60a4885b388cb2b04ca3274',
				getColumns: columns,
				options: {treeOptions},
				showGoto: true
			};

			return factoryService.create(config);
		}
	]);

})(angular);
