/*
 * Copyright(c) RIB Software GmbH
 */
import { CertificateEntityInfo } from '@libs/businesspartner/shared';
import { createLookup, FieldType } from '@libs/ui/common';
import { ProcurementShareContractLookupService } from '@libs/procurement/shared';
import { SalesContractActualCertificateDataService } from '../../services/sales-contract-actual-certificate-data.service';
import { SalesContractActualCertificateBehaviorService } from '../../behaviors/sales-contract-actual-certificate-behavior.service';

export const SALES_CONTRACT_ACTUAL_CERTIFICATE_ENTITY_INFO = CertificateEntityInfo.create({
	grid: {
		behavior: ctx =>  ctx.injector.get(SalesContractActualCertificateBehaviorService),
		title: { key: 'cloud.common.actualCertificateListContainerTitle' },
	},
	form: {
		title: { key: 'cloud.common.actualCertificateDetailContainerTitle' },
		containerUuid: '2b35d9e968344e8399568713e239c6a4'
	},
	dataService: (ctx) => ctx.injector.get(SalesContractActualCertificateDataService),
	permissionUuid: '0e42b1ce237a47c484bd22de041a2dd1',
	layoutConfiguration: () => {
		return import('@libs/businesspartner/certificate').then((module) => {
			const layout = { ...module.BP_CERTIFICATE_LAYOUT };
			layout.transientFields!.push({
				id: 'ordHeaderFk',
				model: 'OrdHeaderFk',
				type: FieldType.Lookup,
				label: { key: 'procurement.common.entityConHeaderFk' },
				readonly: true,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementShareContractLookupService,
					showDescription: true,
					descriptionMember: 'Description',
				}),

			});
			return layout;
		});
	},
});