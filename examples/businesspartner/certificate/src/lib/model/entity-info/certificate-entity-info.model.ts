import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { BP_CERTIFICATE_LAYOUT } from './certificate-layout.model';
import { BusinesspartnerCertificateCertificateDataService } from '../../services/certificate-data.service';
import { BusinesspartnerSharedCertificateGridBehavior, BusinesspartnerSharedCertificateValidationService, CertificateEntityInfo } from '@libs/businesspartner/shared';

export const BP_CERTIFICATE_ENTITY_INFO = CertificateEntityInfo.create({
	grid: {
		title: {
			text: 'Certificates',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerCertificateModuleName + '.certificateListTitle'
		},
		containerUuid: '2c39331cf48c4016af9d17a573388100',
		behavior: ctx => {
			const parentService = ctx.injector.get(BusinesspartnerCertificateCertificateDataService);
			return BusinesspartnerSharedCertificateGridBehavior
				.getService(MODULE_INFO_BUSINESSPARTNER.businesspartnerCertificateModuleName, parentService);
		}
	},
	form: {
		title: {
			text: 'Certificate Detail',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerCertificateModuleName + '.certificateDetailTitle'
		},
		containerUuid: 'fb49ad44d3c3497a8ef693026933fbff',
	},
	permissionUuid: '2c39331cf48c4016af9d17a573388100',
	dataService: (ctx) => ctx.injector.get(BusinesspartnerCertificateCertificateDataService),
	validationService: ctx => {
		const dataService = ctx.injector.get(BusinesspartnerCertificateCertificateDataService);
		return BusinesspartnerSharedCertificateValidationService
			.getService(MODULE_INFO_BUSINESSPARTNER.businesspartnerCertificateModuleName, dataService);
	},
	layoutConfiguration: BP_CERTIFICATE_LAYOUT,
});