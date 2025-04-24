/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILicCostGroup1Entity } from './lic-cost-group-1entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { ILineItemContextEntity } from './line-item-context-entity.interface';

export interface ILicCostGroup1EntityGenerated extends IEntityBase {

/*
 * ChildItems
 */
  ChildItems?: ILicCostGroup1Entity[] | null;

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
  LicCostGroupChildren?: ILicCostGroup1Entity[] | null;

/*
 * LicCostGroupEntitiesLevel1Fk
 */
  LicCostGroupEntitiesLevel1Fk?: ILicCostGroup1Entity[] | null;

/*
 * LicCostGroupEntitiesLevel2Fk
 */
  LicCostGroupEntitiesLevel2Fk?: ILicCostGroup1Entity[] | null;

/*
 * LicCostGroupEntitiesLevel3Fk
 */
  LicCostGroupEntitiesLevel3Fk?: ILicCostGroup1Entity[] | null;

/*
 * LicCostGroupEntitiesLevel4Fk
 */
  LicCostGroupEntitiesLevel4Fk?: ILicCostGroup1Entity[] | null;

/*
 * LicCostGroupEntitiesLevel5Fk
 */
  LicCostGroupEntitiesLevel5Fk?: ILicCostGroup1Entity[] | null;

/*
 * LicCostGroupEntityLevel1Fk
 */
  LicCostGroupEntityLevel1Fk?: ILicCostGroup1Entity | null;

/*
 * LicCostGroupEntityLevel2Fk
 */
  LicCostGroupEntityLevel2Fk?: ILicCostGroup1Entity | null;

/*
 * LicCostGroupEntityLevel3Fk
 */
  LicCostGroupEntityLevel3Fk?: ILicCostGroup1Entity | null;

/*
 * LicCostGroupEntityLevel4Fk
 */
  LicCostGroupEntityLevel4Fk?: ILicCostGroup1Entity | null;

/*
 * LicCostGroupEntityLevel5Fk
 */
  LicCostGroupEntityLevel5Fk?: ILicCostGroup1Entity | null;

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
  LicCostGroupParent?: ILicCostGroup1Entity | null;

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
