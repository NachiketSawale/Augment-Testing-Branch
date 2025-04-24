/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ICosParameterValueEntityGenerated extends IEntityBase {

  /**
   * CosParameterFk
   */
  CosParameterFk: number;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * ParameterValue
   */
  ParameterValue?: string | number | null;

  /**
   * Sorting
   */
  Sorting: number;
}
