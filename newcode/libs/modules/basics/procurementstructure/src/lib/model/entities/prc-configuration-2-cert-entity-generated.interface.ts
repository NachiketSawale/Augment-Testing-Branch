/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcConfiguration2CertEntityGenerated extends IEntityBase {

  /**
   * Amount
   */
  Amount: number;

  /**
   * BpdCertificateTypeFk
   */
  BpdCertificateTypeFk: number;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * GuaranteeCost
   */
  GuaranteeCost?: number | null;

  /**
   * GuaranteeCostPercent
   */
  GuaranteeCostPercent?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsMandatory
   */
  IsMandatory: boolean;

  /**
   * IsMandatorySubSub
   */
  IsMandatorySubSub: boolean;

  /**
   * IsRequired
   */
  IsRequired: boolean;

  /**
   * IsRequiredSubSub
   */
  IsRequiredSubSub: boolean;

  /**
   * PrcConfigHeaderFk
   */
  PrcConfigHeaderFk: number;

  /**
   * PrcStructureFk
   */
  PrcStructureFk: number;

  /**
   * ValidFrom
   */
  ValidFrom?: string | null;

  /**
   * ValidTo
   */
  ValidTo?: string | null;
}
