/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IMaterialLookupEntityGenerated {

  /**
   * Code
   */
  Code?: string | null;

  /**
   * DescriptionInfo1
   */
  DescriptionInfo1?: IDescriptionInfo | null;

  /**
   * DescriptionInfo2
   */
  DescriptionInfo2?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;
}
