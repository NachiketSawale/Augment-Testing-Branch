import { BusinesspartnerSharedCertificateGridBehavior, BusinesspartnerSharedCertificateValidationService, CertificateEntityInfo } from '@libs/businesspartner/shared';
import { BusinesspartnerMainCertificateDataService } from '../../services/certificate-data.service';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { BUSINESS_PARTNER_CERTIFICATE_LAYOUT_SERVICE_TOKEN } from '@libs/businesspartner/interfaces';

export const BP_MAIN_CERTIFICATE_ENTITY_INFO = CertificateEntityInfo.create({
	grid: {
		behavior: ctx => {
			const dataService = ctx.injector.get(BusinesspartnerMainCertificateDataService);
			return BusinesspartnerSharedCertificateGridBehavior
				.getService(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName, dataService);
		}
	},
	permissionUuid: '2c39331cf48c4016af9d17a573388100',
	dataService: (ctx) => ctx.injector.get(BusinesspartnerMainCertificateDataService),
	validationService: ctx => {
		const dataService = ctx.injector.get(BusinesspartnerMainCertificateDataService);
		return BusinesspartnerSharedCertificateValidationService
			.getService(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName, dataService);
	},
	layoutConfiguration: async (ctx) => {
		const layout = (await ctx.lazyInjector.inject(BUSINESS_PARTNER_CERTIFICATE_LAYOUT_SERVICE_TOKEN)).generateLayout();
		layout.excludedAttributes = ['BusinessPartnerFk'];
		return layout;
	},
});