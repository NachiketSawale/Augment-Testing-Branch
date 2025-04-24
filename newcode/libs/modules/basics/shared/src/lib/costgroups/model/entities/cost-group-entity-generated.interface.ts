/*
 * Copyright(c) RIB Software GmbH
 */

import { ICostGroupEntity } from './cost-group-entity.interface';
import {IDescriptionInfo, IEntityBase} from '@libs/platform/common';

export interface ICostGroupEntityGenerated extends IEntityBase {

/*
 * ChildItems
 */
  ChildItems?: ICostGroupEntity[] | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * CostGroupCatFk
 */
  CostGroupCatFk?: number | null;

/*
 * CostGroupChildren
 */
  CostGroupChildren?: ICostGroupEntity[] | null;

/*
 * CostGroupFk
 */
  CostGroupFk?: number | null;

/*
 * CostGroupLevel1Fk
 */
  CostGroupLevel1Fk?: number | null;

/*
 * CostGroupLevel2Fk
 */
  CostGroupLevel2Fk?: number | null;

/*
 * CostGroupLevel3Fk
 */
  CostGroupLevel3Fk?: number | null;

/*
 * CostGroupLevel4Fk
 */
  CostGroupLevel4Fk?: number | null;

/*
 * CostGroupLevel5Fk
 */
  CostGroupLevel5Fk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * Id
 */
  Id: number;

/*
 * IsCrbPrimaryVariant
 */
  IsCrbPrimaryVariant?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * LeadQuantityCalc
 */
  LeadQuantityCalc?: boolean | null;

/*
 * NoLeadQuantity
 */
  NoLeadQuantity?: boolean | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * ReferenceQuantityCode
 */
  ReferenceQuantityCode?: string | null;

/*
 * UomFk
 */
  UomFk?: number | null;
}
