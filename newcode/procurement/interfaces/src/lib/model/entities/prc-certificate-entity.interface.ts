/*
 * Copyright(c) RIB Software GmbH
 */

import { IPrcCertificateEntityGenerated } from './prc-certificate-entity-generated.interface';

export interface IPrcCertificateEntity extends IPrcCertificateEntityGenerated {
    BPName1?: string;

    BpdCertificateFk?: number;

    BusinessPartnerFk?: number;

    Code?: string;

    Description?: string;

    ExpirationDate?: Date;

    IsRequired?: boolean;
    
    IsMandatory?: boolean;

    IsRequiredSubSub?: boolean;

    IsMandatorySubSub?: boolean;

    InvHeaderFk?: number;
}
