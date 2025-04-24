/*
 * Copyright(c) RIB Software GmbH
 */
import { BusinesspartnerSharedCertificateValidationService, CertificateEntityInfo } from '@libs/businesspartner/shared';
import { ProcurementQuoteActualCertificateDataService } from '../../services/procurement-quote-actual-certificate-data.service';
import { ProcurementInternalModule } from '@libs/procurement/shared';
import { BUSINESS_PARTNER_CERTIFICATE_LAYOUT_SERVICE_TOKEN } from '@libs/businesspartner/interfaces';

export const PROCUREMENT_QUOTE_ACTUAL_CERTIFICATE_ENTITY_INFO = CertificateEntityInfo.create({
	grid: {
		title: {
			key: 'businesspartner.certificate' + '.actualCertificateListContainerTitle'
		},
		containerUuid: '0f6ae8f1f34545559c008fca53be2751',
	},
	form: {
		title: {
			key: 'businesspartner.certificate' + '.actualCertificateDetailContainerTitle'
		},
		containerUuid: '724e448cce7249328149f8ce8f830941',
	},
	permissionUuid: '2c39331cf48c4016af9d17a573388100',
	dataService: (ctx) => ctx.injector.get(ProcurementQuoteActualCertificateDataService),
	validationService: ctx => {
		const dataService = ctx.injector.get(ProcurementQuoteActualCertificateDataService);
		return BusinesspartnerSharedCertificateValidationService
			.getService(ProcurementInternalModule.Quote, dataService);
	},
	layoutConfiguration: async (ctx) => {
		return (await ctx.lazyInjector.inject(BUSINESS_PARTNER_CERTIFICATE_LAYOUT_SERVICE_TOKEN)).generateLayout();
	},
});
