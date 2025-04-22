/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BusinesspartnerCertificateCertificateDataService } from '../../services/certificate-data.service';

/**
 * Entity info for business partner certificate characteristics
 */
export const CERTIFICATE_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: '5FB79D9928D244F7B012C3F92441DA95',
	sectionId: BasicsCharacteristicSection.Certificate,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(BusinesspartnerCertificateCertificateDataService);
	},
});
