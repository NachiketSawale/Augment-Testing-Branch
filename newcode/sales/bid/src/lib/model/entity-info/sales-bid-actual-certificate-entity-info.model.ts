/*
 * Copyright(c) RIB Software GmbH
 */
import { CertificateEntityInfo } from '@libs/businesspartner/shared';
import { SalesBidActualCertificateDataService } from '../../services/sales-bid-actual-certificate-data.service';
import { SalesBidActualCertificateBehavior } from '../../behaviors/sales-bid-actual-certificate-behavior.service';

/**
 * Sales Bid Actual Certificate Entity-Info.
 */
export const SALES_BID_ACTUAL_CERTIFICATE_ENTITY_INFO = CertificateEntityInfo.create({
	grid: {
		title: { key: 'cloud.common.actualCertificateListContainerTitle' },
		behavior:(ctx)=>ctx.injector.get(SalesBidActualCertificateBehavior),
	},
	form: {
		title: { key: 'cloud.common.actualCertificateDetailContainerTitle' },
		containerUuid: '059b71ee2dd34f98821198c042407c94'
	},
	dataService: (ctx) => ctx.injector.get(SalesBidActualCertificateDataService),
	permissionUuid: 'cddaf0f9b3fb4fb3800ea50c8c3afb77',
	layoutConfiguration: () => {
		return import('@libs/businesspartner/certificate').then((module) => {
			const layout = { ...module.BP_CERTIFICATE_LAYOUT };
			return layout;
		});
	},
});