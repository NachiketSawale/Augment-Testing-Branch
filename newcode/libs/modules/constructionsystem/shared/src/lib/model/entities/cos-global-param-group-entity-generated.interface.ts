/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { ICosGlobalParamGroupEntity } from './cos-global-param-group-entity.interface';

export interface ICosGlobalParamGroupEntityGenerated extends IEntityBase {

  /**
   * Code
   */
  Code?: string | null;

  /**
   * CosGlobalParamGroupChildren
   */
  CosGlobalParamGroupChildren?: ICosGlobalParamGroupEntity[] | null;

  /**
   * CosGlobalParamGroupFk
   */
  CosGlobalParamGroupFk?: number | null;

  /**
   * CosGlobalParamGroupParent
   */
  CosGlobalParamGroupParent?: ICosGlobalParamGroupEntity | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * HasChildren
   */
  HasChildren: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * MdcLineitemContextFk
   */
  MdcLineitemContextFk: number;

  /**
   * Sorting
   */
  Sorting: number;
}
