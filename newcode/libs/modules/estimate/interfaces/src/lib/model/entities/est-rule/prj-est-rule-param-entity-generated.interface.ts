/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPrjEstRuleParamEntityGenerated extends IEntityBase {

/*
 * ActualValue
 */
  ActualValue?: number | null;

/*
 * AssignedStructureId
 */
  AssignedStructureId?: number | null;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * CostGroupCatFk
 */
  CostGroupCatFk?: number | null;

/*
 * DefaultValue
 */
  DefaultValue?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstLineItemFk
 */
  EstLineItemFk?: number | null;

/*
 * EstParameterGroupFk
 */
  EstParameterGroupFk?: number | null;

/*
 * EstRuleParamValueEntity
 */
  //EstRuleParamValueEntity?: IEstRuleParamValueEntity | null;

/*
 * EstRuleParamValueFk
 */
  EstRuleParamValueFk?: number | null;

/*
 * HasCalculated
 */
  HasCalculated?: boolean | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsLookup
 */
  IsLookup?: boolean | null;

/*
 * IsUnique
 */
  IsUnique?: boolean | null;

/*
 * ParamAssignedItemFk
 */
  ParamAssignedItemFk?: number | null;

/*
 * ParamAssignedType
 */
  ParamAssignedType?: number | null;

/*
 * ParameterText
 */
  ParameterText?: string | null;

/*
 * ParameterValue
 */
  ParameterValue?: number | null;

/*
 * PrjEstRuleFk
 */
  PrjEstRuleFk?: number | null;

/*
 * ProjectEstRuleFk
 */
  ProjectEstRuleFk?: number | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * Sorting
 */
  Sorting?: number | null;

/*
 * UomFk
 */
  UomFk?: number | null;

/*
 * ValueDetail
 */
  ValueDetail?: string | null;

/*
 * ValueText
 */
  ValueText?: string | null;

/*
 * ValueType
 */
  ValueType?: number | null;
}
