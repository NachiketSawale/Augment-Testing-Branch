/*
 * Copyright(c) RIB Software GmbH
 */

import { ICostGroupEntity } from './cost-group-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface ICostGroupEntityGenerated extends IEntityBase {

  /**
   * ChildItems
   */
  ChildItems?: ICostGroupEntity[] | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CostGroupCatFk
   */
  CostGroupCatalogFk: number;

  /**
   * CostGroupChildren
   */
  CostGroupChildren?: ICostGroupEntity[] | null;

  /**
   * CostGroupFk
   */
  CostGroupFk?: number | null;

  /**
   * CostGroupLevel1Fk
   */
  CostGroupLevel1Fk?: number | null;

  /**
   * CostGroupLevel2Fk
   */
  CostGroupLevel2Fk?: number | null;

  /**
   * CostGroupLevel3Fk
   */
  CostGroupLevel3Fk?: number | null;

  /**
   * CostGroupLevel4Fk
   */
  CostGroupLevel4Fk?: number | null;

  /**
   * CostGroupLevel5Fk
   */
  CostGroupLevel5Fk?: number | null;

  /**
   * CostGroupParent
   */
  CostGroupParent?: ICostGroupEntity | null;

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
   * IsCrbPrimaryVariant
   */
  IsCrbPrimaryVariant?: boolean | null;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * LeadQuantityCalc
   */
  LeadQuantityCalc?: boolean | null;

  /**
   * NoLeadQuantity
   */
  NoLeadQuantity?: boolean | null;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * ReferenceQuantityCode
   */
  ReferenceQuantityCode?: string | null;

  /**
   * UomFk
   */
  UomFk: number;
}
