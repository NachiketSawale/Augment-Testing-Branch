/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILicCostGroup5Entity } from './lic-cost-group-5entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { ILineItemContextEntity } from './line-item-context-entity.interface';

export interface ILicCostGroup5EntityGenerated extends IEntityBase {

/*
 * ChildItems
 */
  ChildItems?: ILicCostGroup5Entity[] | null;

/*
 * Code
 */
  Code: string;

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
 * LicCostGroupChildren
 */
  LicCostGroupChildren?: ILicCostGroup5Entity[] | null;

/*
 * LicCostGroupEntitiesLevel1Fk
 */
  LicCostGroupEntitiesLevel1Fk?: ILicCostGroup5Entity[] | null;

/*
 * LicCostGroupEntitiesLevel2Fk
 */
  LicCostGroupEntitiesLevel2Fk?: ILicCostGroup5Entity[] | null;

/*
 * LicCostGroupEntitiesLevel3Fk
 */
  LicCostGroupEntitiesLevel3Fk?: ILicCostGroup5Entity[] | null;

/*
 * LicCostGroupEntitiesLevel4Fk
 */
  LicCostGroupEntitiesLevel4Fk?: ILicCostGroup5Entity[] | null;

/*
 * LicCostGroupEntitiesLevel5Fk
 */
  LicCostGroupEntitiesLevel5Fk?: ILicCostGroup5Entity[] | null;

/*
 * LicCostGroupEntityLevel1Fk
 */
  LicCostGroupEntityLevel1Fk?: ILicCostGroup5Entity | null;

/*
 * LicCostGroupEntityLevel2Fk
 */
  LicCostGroupEntityLevel2Fk?: ILicCostGroup5Entity | null;

/*
 * LicCostGroupEntityLevel3Fk
 */
  LicCostGroupEntityLevel3Fk?: ILicCostGroup5Entity | null;

/*
 * LicCostGroupEntityLevel4Fk
 */
  LicCostGroupEntityLevel4Fk?: ILicCostGroup5Entity | null;

/*
 * LicCostGroupEntityLevel5Fk
 */
  LicCostGroupEntityLevel5Fk?: ILicCostGroup5Entity | null;

/*
 * LicCostGroupFk
 */
  LicCostGroupFk?: number | null;

/*
 * LicCostGroupLevel1Fk
 */
  LicCostGroupLevel1Fk?: number | null;

/*
 * LicCostGroupLevel2Fk
 */
  LicCostGroupLevel2Fk?: number | null;

/*
 * LicCostGroupLevel3Fk
 */
  LicCostGroupLevel3Fk?: number | null;

/*
 * LicCostGroupLevel4Fk
 */
  LicCostGroupLevel4Fk?: number | null;

/*
 * LicCostGroupLevel5Fk
 */
  LicCostGroupLevel5Fk?: number | null;

/*
 * LicCostGroupParent
 */
  LicCostGroupParent?: ILicCostGroup5Entity | null;

/*
 * LineItemContextEntity
 */
  LineItemContextEntity?: ILineItemContextEntity | null;

/*
 * LineItemContextFk
 */
  LineItemContextFk: number;

/*
 * Quantity
 */
  Quantity: number;

/*
 * UomFk
 */
  UomFk: number;
}
