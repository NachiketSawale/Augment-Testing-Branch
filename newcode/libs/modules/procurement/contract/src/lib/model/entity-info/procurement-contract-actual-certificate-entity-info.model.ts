/*
 * Copyright(c) RIB Software GmbH
 */
import { BusinesspartnerSharedCertificateValidationService, CertificateEntityInfo } from '@libs/businesspartner/shared';
import { ProcurementContractActualCertificateDataService } from '../../services/procurement-contract-actual-certificate-data.service';
import { FieldType, ILookupFieldOverload } from '@libs/ui/common';
import { ProcurementInternalModule, ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';
import { ProcurementContractActualCertificateBehaviorService } from '../../behaviors/procurement-contract-actual-certificate-behavior.service';
import { BUSINESS_PARTNER_CERTIFICATE_LAYOUT_SERVICE_TOKEN, ICertificateEntity } from '@libs/businesspartner/interfaces';

export const PROCUREMENT_CONTRACT_ACTUAL_CERTIFICATE_ENTITY_INFO = CertificateEntityInfo.create({
	grid: {
		behavior: ctx => ctx.injector.get(ProcurementContractActualCertificateBehaviorService),
	},
	permissionUuid: '2c39331cf48c4016af9d17a573388100',
	dataService: (ctx) => ctx.injector.get(ProcurementContractActualCertificateDataService),
	validationService: ctx => {
		const dataService = ctx.injector.get(ProcurementContractActualCertificateDataService);
		return BusinesspartnerSharedCertificateValidationService
			.getService(ProcurementInternalModule.Contract, dataService);
	},
	layoutConfiguration: async (ctx) => {
		const layout = (await ctx.lazyInjector.inject(BUSINESS_PARTNER_CERTIFICATE_LAYOUT_SERVICE_TOKEN)).generateLayout();
		layout.transientFields?.push({
			id: 'conHeaderFk',
			model: 'ConHeaderFk',
			type: FieldType.Lookup,
			label: {key: 'procurement.common.entityConHeaderFk'},
			lookupOptions: (ProcurementSharedLookupOverloadProvider.provideContractLookupOverload(false) as ILookupFieldOverload<ICertificateEntity>).lookupOptions
		});
		return layout;
	},
});
