/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosGroupEntity } from './cos-group-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ICosGroupEntityGenerated extends IEntityBase {

  /**
   * Code
   */
  Code?: string | null;

  /**
   * CosGroupFk
   */
  CosGroupFk?: number | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Group
   */
  Group?: string | null;

  /**
   * GroupChildren
   */
  GroupChildren?: ICosGroupEntity[] | null;

  /**
   * GroupParent
   */
  GroupParent?: ICosGroupEntity | null;

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
   * LineItemContextFk
   */
  LineItemContextFk: number;

  /**
   * Sorting
   */
  Sorting: number;
}
