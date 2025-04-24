/*
 * Copyright(c) RIB Software GmbH
 */

import { IMaterialGroupEntity } from '@libs/basics/shared';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMaterialGroupAIMappingEntityGenerated extends IEntityBase {

  /**
   * ChildItems
   */
  ChildItems?: IMaterialGroupEntity[] | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CostCodeFk
   */
  CostCodeFk?: number | null;

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
   * IsCheckAi
   */
  IsCheckAi: boolean;

  /**
   * MaterialCatalogFk
   */
  MaterialCatalogFk: number;

  /**
   * MaterialGroupCheckedValue
   */
  MaterialGroupCheckedValue: boolean;

  /**
   * MaterialGroupChildren
   */
  MaterialGroupChildren?: number[] | null;

  /**
   * MaterialGroupFk
   */
  MaterialGroupFk?: number | null;

  /**
   * OrigPrcStructureFk
   */
  OrigPrcStructureFk?: number | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * SuggestedPrcStructureFks
   */
  SuggestedPrcStructureFks?: number[] | null;
}
