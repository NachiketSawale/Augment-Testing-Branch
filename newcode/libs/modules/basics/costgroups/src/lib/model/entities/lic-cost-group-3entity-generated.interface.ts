/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILicCostGroup3Entity } from './lic-cost-group-3entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { ILineItemContextEntity } from './line-item-context-entity.interface';

export interface ILicCostGroup3EntityGenerated extends IEntityBase {

/*
 * ChildItems
 */
  ChildItems?: ILicCostGroup3Entity[] | null;

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
  LicCostGroupChildren?: ILicCostGroup3Entity[] | null;

/*
 * LicCostGroupEntitiesLevel1Fk
 */
  LicCostGroupEntitiesLevel1Fk?: ILicCostGroup3Entity[] | null;

/*
 * LicCostGroupEntitiesLevel2Fk
 */
  LicCostGroupEntitiesLevel2Fk?: ILicCostGroup3Entity[] | null;

/*
 * LicCostGroupEntitiesLevel3Fk
 */
  LicCostGroupEntitiesLevel3Fk?: ILicCostGroup3Entity[] | null;

/*
 * LicCostGroupEntitiesLevel5Fk
 */
  LicCostGroupEntitiesLevel5Fk?: ILicCostGroup3Entity[] | null;

/*
 * LicCostGroupEntityLevel1Fk
 */
  LicCostGroupEntityLevel1Fk?: ILicCostGroup3Entity | null;

/*
 * LicCostGroupEntityLevel2Fk
 */
  LicCostGroupEntityLevel2Fk?: ILicCostGroup3Entity | null;

/*
 * LicCostGroupEntityLevel3Fk
 */
  LicCostGroupEntityLevel3Fk?: ILicCostGroup3Entity | null;

/*
 * LicCostGroupEntityLevel4Fk
 */
  LicCostGroupEntityLevel4Fk?: ILicCostGroup3Entity | null;

/*
 * LicCostGroupEntityLevel5Fk
 */
  LicCostGroupEntityLevel5Fk?: ILicCostGroup3Entity | null;

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
  LicCostGroupParent?: ILicCostGroup3Entity | null;

/*
 * LicCostgroupEntitiesLevel4Fk
 */
  LicCostgroupEntitiesLevel4Fk?: ILicCostGroup3Entity[] | null;

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
