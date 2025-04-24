(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';
	var moduleName = 'procurement.invoice';

	angular.module(moduleName).factory('invoiceMainStandardConfigurationService', ['platformUIStandardConfigService', 'procurementInvoiceTranslationService', 'platformSchemaService', 'procurementInvoiceLayout',

		function (platformUIStandardConfigService, procurementInvoiceTranslationService, platformSchemaService, procurementInvoiceLayout) {

			function getLayout(){
				procurementInvoiceLayout.overloads.quantitytotal = {};
				return procurementInvoiceLayout;
			}

			var BaseService = platformUIStandardConfigService;
			var invoiceDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'InvHeaderDto', moduleSubModule: 'Procurement.Invoice'} );
			if(invoiceDomainSchema) {
				invoiceDomainSchema = invoiceDomainSchema.properties;
				invoiceDomainSchema.Info ={ domain : 'image'};
				invoiceDomainSchema.Rule ={ domain : 'imageselect'};
				invoiceDomainSchema.Param ={ domain : 'imageselect'};
			}

			function InvoiceUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			InvoiceUIStandardService.prototype = Object.create(BaseService.prototype);
			InvoiceUIStandardService.prototype.constructor = InvoiceUIStandardService;
			const entityInformation = { module: angular.module( 'procurement.invoice'), moduleName: 'Procurement.Invoice', entity: 'InvHeader' };
			return new BaseService( getLayout(), invoiceDomainSchema, procurementInvoiceTranslationService,entityInformation);
		}
	]);
})();