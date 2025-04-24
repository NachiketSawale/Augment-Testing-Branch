/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IBusinessPartnerStatusEntityGenerated {

  /**
   * AccessRightDescriptor2Fk
   */
  AccessRightDescriptor2Fk?: number | null;

  /**
   * AccessRightDescriptor3Fk
   */
  AccessRightDescriptor3Fk?: number | null;

  /**
   * AccessRightDescriptor4Fk
   */
  AccessRightDescriptor4Fk?: number | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * EditName
   */
  EditName: boolean;

  /**
   * Icon
   */
  Icon: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsApproved
   */
  IsApproved: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsReadonly
   */
  IsReadonly: boolean;

  /**
   * MessageInfo
   */
  MessageInfo?: IDescriptionInfo | null;
}
