/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBp2controllinggroupEntityGenerated extends IEntityBase {

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * ContextFk
   */
  ContextFk: number;

  /**
   * ControllinggroupFk
   */
  ControllinggroupFk: number;

  /**
   * ControllinggrpdetailFk
   */
  ControllinggrpdetailFk: number;

  /**
   * Id
   */
  Id: number;
}
