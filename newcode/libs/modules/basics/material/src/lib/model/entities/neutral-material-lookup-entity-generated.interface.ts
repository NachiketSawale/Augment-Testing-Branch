/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface INeutralMaterialLookupEntityGenerated {

  /**
   * Code
   */
  Code?: string | null;

  /**
   * Description
   */
  Description?: string | null;

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
