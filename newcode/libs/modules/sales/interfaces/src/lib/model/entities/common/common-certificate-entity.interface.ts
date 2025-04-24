/*
 * Copyright(c) RIB Software GmbH
 */

import { IBidCertificateEntity } from '../bid/bid-certificate-entity.interface';
import { IOrdCertificateEntity } from '../contract/ord-certificate-entity.interface';

export interface ICommonCertificateEntity extends IBidCertificateEntity, IOrdCertificateEntity {

}
