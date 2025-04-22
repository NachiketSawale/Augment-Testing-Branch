/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBp2externalEntityGenerated extends IEntityBase {

  /**
   * BasExternalsourceFk
   */
  BasExternalsourceFk: number;

  /**
   * BpdBusinesspartnerFk
   */
  BpdBusinesspartnerFk: number;

  /**
   * ExternalDescription
   */
  ExternalDescription?: string | null;

  /**
   * ExternalId
   */
  ExternalId?: string | null;

  /**
   * Id
   */
  Id: number;
}
