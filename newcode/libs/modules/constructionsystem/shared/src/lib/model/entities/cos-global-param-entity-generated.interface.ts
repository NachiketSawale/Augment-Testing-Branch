/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface ICosGlobalParamEntityGenerated extends IEntityBase {

/*
 * CosGlobalParamGroupFk
 */
  CosGlobalParamGroupFk: number;

/*
 * CosParameterTypeFk
 */
  CosParameterTypeFk: number;

/*
 * DefaultValue
 */
  DefaultValue?: string | number | boolean | Date | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * IsLookup
 */
  IsLookup: boolean;

/*
 * MdcLineItemContextFk
 */
  MdcLineItemContextFk: number;

/*
 * Sorting
 */
  Sorting: number;

/*
 * UomFk
 */
  UomFk: number;

/*
 * VariableName
 */
  VariableName?: string | null;
}
