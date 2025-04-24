/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstimateCompositeEntity } from '@libs/estimate/shared';

/**
 * PrjEstCreationDataGenerated Interface
 */
export interface IPrjEstCreationDataGenerated {

/*
 * Code
 */
  Code?: string | null;

/*
 * Codes
 */
  Codes?: string[] | null;

/*
 * DoCalculateRuleParam
 */
  DoCalculateRuleParam?: boolean | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstTypeFk
 */
  EstTypeFk?: number | null;

/*
 * EstimateComplete
 */
  EstimateComplete?: IEstimateCompositeEntity | null;

/*
 * IsCopyBaseCost
 */
  IsCopyBaseCost?: boolean | null;

/*
 * IsCopyBudget
 */
  IsCopyBudget?: boolean | null;

/*
 * IsCopyCostTotalToBudget
 */
  IsCopyCostTotalToBudget?: boolean | null;

/*
 * IsDeleteItemAssignment
 */
  IsDeleteItemAssignment?: boolean | null;

/*
 * JobCode
 */
  JobCode?: string | null;

/*
 * JobDescription
 */
  JobDescription?: string | null;

/*
 * LineItemIds
 */
  LineItemIds?: number[] | null;

/*
 * NewEstType
 */
  NewEstType?: number | null;

/*
 * PrjProjectFk
 */
  PrjProjectFk?: number | null;

/*
 * SelectedLevel
 */
  SelectedLevel?: string | null;

/*
 * SetFixUnitPrice
 */
  SetFixUnitPrice?: boolean | null;

/*
 * UpdateControllingStrBudget
 */
  UpdateControllingStrBudget?: boolean | null;

/*
 * VersionComment
 */
  VersionComment?: string | null;

/*
 * VersionDescription
 */
  VersionDescription?: string | null;

/*
 * VersionJob
 */
  VersionJob?: string | null;

/*
 * VersionJobDescription
 */
  VersionJobDescription?: string | null;
}
