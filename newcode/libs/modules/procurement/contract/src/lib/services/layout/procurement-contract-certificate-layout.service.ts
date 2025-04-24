/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LazyInjectable } from '@libs/platform/common';
import { ProcurementCommonCertificateLayoutService } from '@libs/procurement/common';
import { PRC_COMMON_CERTIFICATE_LAYOUT_SERVICE_TOKEN } from '@libs/procurement/interfaces';

@LazyInjectable({
    token: PRC_COMMON_CERTIFICATE_LAYOUT_SERVICE_TOKEN,
    useAngularInjection: true
})
@Injectable({
    providedIn: 'root'
})
export class ProcurementContractCertificateLayoutService extends ProcurementCommonCertificateLayoutService {}