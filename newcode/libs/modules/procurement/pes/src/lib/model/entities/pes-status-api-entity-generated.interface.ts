/*
 * Copyright(c) RIB Software GmbH
 */

import { ITranslated } from '@libs/platform/common';

export interface IPesStatusApiEntityGenerated {

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: ITranslated | null;

  /**
   * Icon
   */
  Icon: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsAdviced
   */
  IsAdviced: boolean;

  /**
   * IsDelivered
   */
  IsDelivered: boolean;

  /**
   * Sorting
   */
  Sorting: number;
}
