/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IMaterial2CertificateEntityGenerated extends IEntityBase {

  /**
   * BpdCertificateTypeFk
   */
  BpdCertificateTypeFk: number;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsMandatory
   */
  IsMandatory: boolean;

  /**
   * IsMandatorySub
   */
  IsMandatorySub: boolean;

  /**
   * IsRequired
   */
  IsRequired: boolean;

  /**
   * IsRequiredSub
   */
  IsRequiredSub: boolean;

  /**
   * MaterialFk
   */
  MaterialFk: number;

  /**
   * PrcStructureFk
   */
  PrcStructureFk: number;
}
