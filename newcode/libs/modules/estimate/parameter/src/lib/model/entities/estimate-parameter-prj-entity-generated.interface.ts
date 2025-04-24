/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

/**
 * Generated file for entities
 */

export interface IEstimateParameterPrjEntityGenerated extends IEntityBase {

/*
 * AssignedStructureId
 */
  AssignedStructureId?: number | null;

/*
 * Code
 */
  Code: string;

/*
 * DefaultValue
 */
  DefaultValue: number;

/*
 * DescriptionInfo
 */
  DescriptionInfo: IDescriptionInfo;

/*
 * EstHeaderFk
 */
  EstHeaderFk: number;

/*
 * EstParameterGroupFk
 */
  EstParameterGroupFk: number;

/*
 * EstRuleParamValueFk
 */
  EstRuleParamValueFk?: number | null;

/*
 * HasCalculated
 */
  HasCalculated: boolean;

/*
 * Id
 */
  Id: number;

/*
 * IsLookup
 */
  IsLookup: boolean;

/*
 * ParameterText
 */
  ParameterText: string;

/*
 * ParameterValue
 */
  ParameterValue: number;

/*
 * ProjectEstRuleFk
 */
  ProjectEstRuleFk?: number | null;

/*
 * ProjectFk
 */
  ProjectFk: number;

/*
 * Sorting
 */
  Sorting: number;

/*
 * UoMFk
 */
  UoMFk: number;

/*
 * UomFk
 */
  UomFk:number;

/*
 * ValueDetail
 */
  ValueDetail: string;

/*
 * ValueText
 */
  ValueText: string;

/*
 * ValueType
 */
  ValueType: number;
}
