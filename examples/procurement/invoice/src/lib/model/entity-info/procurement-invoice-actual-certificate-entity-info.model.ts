/*
 * Copyright(c) RIB Software GmbH
 */
import { BusinesspartnerSharedCertificateValidationService, CertificateEntityInfo } from '@libs/businesspartner/shared';
import { ILookupFieldOverload } from '@libs/ui/common';
import { ProcurementInternalModule, ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';
import { ProcurementInvoiceActualCertificateDataService } from '../../services/procurement-invoice-actual-certificate-data.service';
import { BUSINESS_PARTNER_CERTIFICATE_LAYOUT_SERVICE_TOKEN, ICertificateEntity } from '@libs/businesspartner/interfaces';

export const PROCUREMENT_INVOICE_ACTUAL_CERTIFICATE_ENTITY_INFO = CertificateEntityInfo.create({
	grid: {
		containerUuid: 'ef81e82e2ec3496d8916f3c486cd2778',
	},
	permissionUuid: '2c39331cf48c4016af9d17a573388100',
	dataService: (ctx) => ctx.injector.get(ProcurementInvoiceActualCertificateDataService),
	validationService: ctx => {
		const dataService = ctx.injector.get(ProcurementInvoiceActualCertificateDataService);
		return BusinesspartnerSharedCertificateValidationService
			.getService(ProcurementInternalModule.Invoice, dataService);
	},
	layoutConfiguration: async (ctx) => {
		const layout = (await ctx.lazyInjector.inject(BUSINESS_PARTNER_CERTIFICATE_LAYOUT_SERVICE_TOKEN)).generateLayout();
		layout.transientFields?.push({
			id: 'conHeaderFk',
			model: 'ConHeaderFk',
			label: {key: 'procurement.common.entityConHeaderFk'},
			lookupOptions: (ProcurementSharedLookupOverloadProvider.provideContractLookupOverload(true, 'Description', true) as ILookupFieldOverload<ICertificateEntity>).lookupOptions,
		});
		return layout;
	},
});
