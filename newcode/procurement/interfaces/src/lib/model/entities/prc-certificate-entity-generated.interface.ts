/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcCertificateEntityGenerated extends IEntityBase {

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
   * IsValued
   */
  IsValued?: boolean | null;

  /**
   * Ismandatory
   */
  Ismandatory: boolean;

  /**
   * Ismandatorysubsub
   */
  Ismandatorysubsub: boolean;

  /**
   * Isrequired
   */
  Isrequired: boolean;

  /**
   * Isrequiredsubsub
   */
  Isrequiredsubsub: boolean;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * RequiredAmount
   */
  RequiredAmount: number;

  /**
   * RequiredBy
   */
  RequiredBy?: string | null;

  /**
   * ValidFrom
   */
  ValidFrom?: string | null;

  /**
   * ValidTo
   */
  ValidTo?: string | null;

  /**
   * configurationModelData
   */
  // configurationModelData?: IPrcConfiguration2CertEntity[] | null;
}
