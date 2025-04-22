/*
 * Copyright(c) RIB Software GmbH
 */

import { ICertificateEntity } from './certificate-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICertificate2subsidiaryEntityGenerated extends IEntityBase {

  /**
   * CertificateEntity
   */
  CertificateEntity?: ICertificateEntity | null;

  /**
   * CertificateFk
   */
  CertificateFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk: number;
}
