/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IProjectStockEntityGenerated extends IEntityBase, IEntityIdentification {

/*
 * AddressFk
 */
  AddressFk: number | null;

/*
 * ClerkFk
 */
  ClerkFk: number | null;

/*
 * Code
 */
  Code: string;

/*
 * CommentText
 */
  CommentText: string;

/*
 * ControllingUnitFk
 */
  ControllingUnitFk: number | null;

/*
 * CurrencyFk
 */
  CurrencyFk: number;

/*
 * Description
 */
  Description: string;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsLocationMandatory
 */
  IsLocationMandatory: boolean;

/*
 * IsProvisionAllowed
 */
  IsProvisionAllowed: boolean;

/*
 * ProjectFk
 */
  ProjectFk: number;

/*
 * StockAccountingTypeFk
 */
  StockAccountingTypeFk: number;

/*
 * StockTypeFk
 */
  StockTypeFk: number;

/*
 * StockValuationRuleFk
 */
  StockValuationRuleFk: number;
}
