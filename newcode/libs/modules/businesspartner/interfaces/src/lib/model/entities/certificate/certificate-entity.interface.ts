/*
 * Copyright(c) RIB Software GmbH
 */

import { IBasicsCustomizeCertificateStatusEntity, IBasicsCustomizeCertificateTypeEntity } from '@libs/basics/interfaces';
import { ICertificateEntityGenerated } from './certificate-entity-generated.interface';

export interface ICertificateEntity extends ICertificateEntityGenerated {
    _typeItem?: IBasicsCustomizeCertificateTypeEntity | null;
    _statusItem?: IBasicsCustomizeCertificateStatusEntity | null;
}
