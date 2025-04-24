/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IEstCopyOptionBaseEntity extends IEntityBase {

/*
 * CopyResourcesTo
 */
  CopyResourcesTo?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * LiActivity
 */
  LiActivity?: boolean | null;

/*
 * LiBoq
 */
  LiBoq?: boolean | null;

/*
 * LiBudget
 */
  LiBudget?: boolean | null;

/*
 * LiCharacteristics
 */
  LiCharacteristics?: boolean | null;

/*
 * LiControllingUnit
 */
  LiControllingUnit?: boolean | null;

/*
 * LiCostFactors
 */
  LiCostFactors?: boolean | null;

/*
 * LiCostGroup
 */
  LiCostGroup?: boolean | null;

/*
 * LiLocation
 */
  LiLocation?: boolean | null;

/*
 * LiPackageItemAssignment
 */
  LiPackageItemAssignment?: boolean | null;

/*
 * LiPrjCostGroup
 */
  LiPrjCostGroup?: boolean | null;

/*
 * LiProcurementStructure
 */
  LiProcurementStructure?: boolean | null;

/*
 * LiQuantity
 */
  LiQuantity?: boolean | null;

/*
 * LiQuantityFactors
 */
  LiQuantityFactors?: boolean | null;

/*
 * LiResources
 */
  LiResources?: boolean | null;

/*
 * LiWicBoq
 */
  LiWicBoq?: boolean | null;

/*
 * ResCharacteristics
 */
  ResCharacteristics?: boolean | null;

/*
 * ResCostFactors
 */
  ResCostFactors?: boolean | null;

/*
 * ResCostUnit
 */
  ResCostUnit?: boolean | null;

/*
 * ResPackageItemAssignment
 */
  ResPackageItemAssignment?: boolean | null;

/*
 * ResQuantity
 */
  ResQuantity?: boolean | null;

/*
 * ResQuantityFactors
 */
  ResQuantityFactors?: boolean | null;
}
