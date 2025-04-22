/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonCertificateEntityInfo } from '@libs/procurement/common';
import { ProcurementPackageCertificateDataService } from '../../services/procurement-package-certificate-data.service';

/**
 * procurement package certificate entity info
 */
export const PROCUREMENT_PACKAGE_CERTIFICATE_ENTITY_INFO = ProcurementCommonCertificateEntityInfo.create({
	permissionUuid: '6b32ae890e4a4317bf1c422e9a492f30',
	formUuid: '31423155a00d4fec9dcaa61b9f51ed6e',
	dataServiceToken: ProcurementPackageCertificateDataService,
});