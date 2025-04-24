/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IBoqItemEntity } from './boq-item-entity.interface';


export interface IBoqItemParamEntityGenerated extends IEntityBase {

/*
 * AssignedStructureId
 */
  AssignedStructureId?: number | null;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * BoqItemEntity
 */
  BoqItemEntity?: IBoqItemEntity | null;

/*
 * BoqItemFk
 */
  BoqItemFk: number;

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
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstParameterGroupFk
 */
  EstParameterGroupFk: number;

/*
 * EstRuleParamValueFk
 */
  EstRuleParamValueFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsLookup
 */
  IsLookup: boolean;

/*
 * ParamAssignedItemFk
 */
  ParamAssignedItemFk?: number | null;

/*
 * ParameterText
 */
  ParameterText?: string | null;

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
  ProjectFk?: number | null;

/*
 * Sorting
 */
  Sorting: number;

/*
 * UomFk
 */
  UomFk: number;

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
  ValueType: number;
}
