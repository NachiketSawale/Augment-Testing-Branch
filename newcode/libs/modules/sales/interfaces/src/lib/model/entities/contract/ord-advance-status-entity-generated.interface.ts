/*
 * Copyright(c) RIB Software GmbH
 */

import { IOrdAdvanceEntity } from './ord-advance-entity.interface';
import { IDescriptionInfo } from '@libs/platform/common';

export interface IOrdAdvanceStatusEntityGenerated {

  /**
   * Code
   */
  Code: string;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Icon
   */
  Icon: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsAgreed
   */
  IsAgreed: boolean;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsIssued
   */
  IsIssued: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsPaymentReceived
   */
  IsPaymentReceived: boolean;

  /**
   * IsReadOnly
   */
  IsReadOnly: boolean;

  /**
   * OrdAdvanceEntities
   */
  OrdAdvanceEntities?: IOrdAdvanceEntity[] | null;

  /**
   * Sorting
   */
  Sorting: number;
}
