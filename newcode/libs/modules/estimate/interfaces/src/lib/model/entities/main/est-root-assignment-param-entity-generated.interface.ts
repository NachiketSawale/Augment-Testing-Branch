/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstRootAssignmentParamEntityGenerated extends IEntityBase {

/*
 * Code
 */
  Code: string;

/*
 * DefaultValue
 */
  DefaultValue?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstParameterGroupFk
 */
  EstParameterGroupFk?: number | null;

/*
 * EstRootAssignmentDetailFk
 */
  EstRootAssignmentDetailFk?: number | null;

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
  IsLookup?: boolean | null;

/*
 * ParameterText
 */
  ParameterText?: string | null;

/*
 * ParameterValue
 */
  ParameterValue?: number | null;

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
