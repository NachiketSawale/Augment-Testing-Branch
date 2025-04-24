/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICompanyCostHeaderEntity } from './company-cost-header-entity.interface';
import { ICompanyCostDataEntity } from './company-cost-data-entity.interface';
import { IEntityBase } from '@libs/platform/common';


export interface ICompanyCostDataEntityGenerated extends IEntityBase {

/*
 * AccountFk
 */
  AccountFk?: number | null;

/*
 * Amount
 */
  Amount?: number | null;

/*
 * AmountOc
 */
  AmountOc?: number | null;

/*
 * AmountProject
 */
  AmountProject?: number | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * CompanyCostHeaderEntity
 */
  CompanyCostHeaderEntity?: ICompanyCostHeaderEntity | null;

/*
 * CompanyCostHeaderFk
 */
  CompanyCostHeaderFk?: number | null;

/*
 * CompanyCurrencyFk
 */
  CompanyCurrencyFk?: number | null;

/*
 * CurrencyFk
 */
  CurrencyFk?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * LedgerContextFk
 */
  LedgerContextFk?: number | null;

/*
 * MdcContrCostCodeFk
 */
  MdcContrCostCodeFk?: number | null;

/*
 * MdcControllingUnitFk
 */
  MdcControllingUnitFk?: number | null;

/*
 * MdcCostCodeFk
 */
  MdcCostCodeFk?: number | null;

/*
 * NominalDimension1
 */
  NominalDimension1?: string | null;

/*
 * NominalDimension2
 */
  NominalDimension2?: string | null;

/*
 * NominalDimension3
 */
  NominalDimension3?: string | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * UomFk
 */
  UomFk?: number | null;

/*
 * controllingActualsCostData
 */
  controllingActualsCostData?: ICompanyCostDataEntity | null;
}
