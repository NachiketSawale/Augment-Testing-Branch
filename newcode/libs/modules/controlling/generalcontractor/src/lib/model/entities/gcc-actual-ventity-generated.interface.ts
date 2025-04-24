/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IGccActualVEntityGenerated extends IEntityBase {

/*
 * Account
 */
  Account?: string | null;

/*
 * AccountDescription
 */
  AccountDescription?: IDescriptionInfo | null;

/*
 * Amount
 */
  Amount?: number | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * CompanyFk
 */
  CompanyFk?: number | null;

/*
 * CompanyPeriod
 */
  CompanyPeriod?: number | null;

/*
 * CompanyYear
 */
  CompanyYear?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * MdcControllingUnit
 */
  MdcControllingUnit?: string | null;

/*
 * MdcControllingUnitDescription
 */
  MdcControllingUnitDescription?: IDescriptionInfo | null;

/*
 * MdcControllingUnitFk
 */
  MdcControllingUnitFk?: number | null;

/*
 * NominalDimension1
 */
  NominalDimension1?: string | null;

/*
 * NominalDimension2
 */
  NominalDimension2?: string | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * Uom
 */
  Uom?: string | null;

/*
 * UomDescription
 */
  UomDescription?: IDescriptionInfo | null;

/*
 * ValueTypeDescription
 */
  ValueTypeDescription?: IDescriptionInfo | null;
}
