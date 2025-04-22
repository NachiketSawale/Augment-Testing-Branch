/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';

import { BusinesspartnerMainCertificateDataService } from '../../services/certificate-data.service';

/**
 * Businesspartner Certificate Characteristic Entity info model.
 */
export const BUSINESS_PARTNER_CERTIFICATE_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: '5fb79d9928d244f7b012c3f92441dA95',
	sectionId: BasicsCharacteristicSection.Certificate,
	gridTitle:'businesspartner.main.certificateCharacteristicContainerTitle',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(BusinesspartnerMainCertificateDataService);
	},
});