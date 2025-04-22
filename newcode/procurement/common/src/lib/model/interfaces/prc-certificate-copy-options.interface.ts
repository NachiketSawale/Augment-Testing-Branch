/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcCertificateEntity } from '@libs/procurement/interfaces';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { ProcurementCommonCertificateDataService } from '../../services/procurement-common-certificate-data.service';

export interface IPrcCertificateCopyOptions<T extends IPrcCertificateEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>> {
    url: string;
    dataService: ProcurementCommonCertificateDataService<T, PT, PU>;
    parameter: {
        PrcHeaderId?: number;
        PrjProjectId?: number;
        MdcMaterialId?: number;
        InvHeaderId?: number;
        BpdCertificateTypeIds?: number[];

    };
    subModule?: string;
}