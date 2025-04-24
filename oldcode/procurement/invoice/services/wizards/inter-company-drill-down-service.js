/**
 * Created by lcn on 20/12/2024.
 */

(function (angular) {
	'use strict';

	const moduleName = 'procurement.invoice';

	angular.module(moduleName).service('procurementInvoiceInterCompanyDrillDownService', [
		'procurementCommonInterCompanyDrillDownFactoryService',
		function (factoryService) {

			const commonTranslate = 'procurement.common.wizard.createInterCompany.';
			const translateSource = 'procurement.invoice.wizard.createInterCompanyBill.';

			// Helper function to create column configuration
			const createColumn = (id, field, width, translatePrefix, type, lookupType = '', lookupField = '') =>
				factoryService.createColumn(id, field, width, translatePrefix, type, lookupType, lookupField);

			// Columns configuration
			const columns = [
				createColumn('supplierCode', 'SupplierId', 100, translateSource, 'lookup', 'supplier', 'Code'),
				createColumn('supplierName', 'SupplierId', 150, translateSource, 'lookup', 'supplier', 'Description'),
				createColumn('invoiceNo', 'InvHeaderId', 120, translateSource, 'lookup', 'InvHeaderChained', 'Code'),
				createColumn('externalNo', 'InvHeaderId', 100, translateSource, 'lookup', 'InvHeaderChained', 'Reference'),
				createColumn('invoiceDate', 'InvoiceDate', 80, commonTranslate, 'date'),
				createColumn('postDate', 'PostDate', 80, commonTranslate, 'date'),
				createColumn('description', 'InvHeaderId', 150, commonTranslate, 'lookup', 'InvHeaderChained', 'Description'),
				createColumn('billedAmount', 'BilledAmount', 110, commonTranslate, 'money'),
				createColumn('surchargeAmount', 'SurchargeAmount', 102, commonTranslate, 'money'),
				createColumn('totalAmount', 'TotalAmount', 82, commonTranslate, 'money')
			];

			// Configuration object
			const config = {
				gridId: 'c9cbe98a257345ea854b32ff0675cb77',
				getColumns: columns,
				showGoto: true
			};

			return factoryService.create(config);
		}
	]);

})(angular);
