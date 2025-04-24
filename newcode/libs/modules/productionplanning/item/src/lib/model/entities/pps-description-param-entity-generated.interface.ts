/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPPSDescriptionParamEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * ParameterText
 */
  ParameterText?: string | null;

/*
 * ProductDescriptionFk
 */
  ProductDescriptionFk?: number | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * Sorting
 */
  Sorting?: number | null;

/*
 * UomFk
 */
  UomFk?: number | null;

/*
 * ValueText
 */
  ValueText?: string | null;

/*
 * VariableName
 */
  VariableName?: string | null;
}
