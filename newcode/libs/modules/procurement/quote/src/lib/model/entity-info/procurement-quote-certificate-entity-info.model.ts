/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonCertificateEntityInfo } from '@libs/procurement/common';
import { ProcurementQuoteCertificateDataService } from '../../services/procurement-quote-certificate-data.service';

/**
 * Entity info for procurement Quote Certificate
 */
export const PROCUREMENT_QUOTE_CERTIFICATE_ENTITY_INFO = ProcurementCommonCertificateEntityInfo.create({
    permissionUuid: '2c28d44a8d1442d1a7f44ace864eccc9',
    formUuid: 'ee11b5d4ee7448fba435b0551220057f',
    dataServiceToken: ProcurementQuoteCertificateDataService,
});