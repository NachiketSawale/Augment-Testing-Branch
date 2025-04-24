/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import {IEstimateRuleParameterValueBaseEntity} from '@libs/estimate/interfaces';

export interface IHandleParamValueGenerated {

/*
 * Code
 */
  Code?: string | null;

/*
 * IsMerge
 */
  IsMerge?: boolean | null;

/*
 * IsProject
 */
  IsProject?: boolean | null;

/*
 * IsUnique
 */
  IsUnique?: boolean | null;

/*
 * MainItemId
 */
  MainItemId?: number | null;

/*
 * MdcLineItemContextFk
 */
  MdcLineItemContextFk?: number | null;

/*
 * ProjectId
 */
  ProjectId?: number | null;

/*
 * ValueType
 */
  ValueType?: number | null;

/*
 * existItems
 */
  existItems?: IEstimateRuleParameterValueBaseEntity[] | null;

/*
 * newItems
 */
  newItems?: IEstimateRuleParameterValueBaseEntity[] | null;
}
