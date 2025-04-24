/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ICosTemplateEntityGenerated extends IEntityBase {

  /**
   * CosHeaderFk
   */
  CosHeaderFk: number;

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
   * SelectStatement
   */
  SelectStatement?: string | null;

  /**
   * Sorting
   */
  Sorting: number;
}
