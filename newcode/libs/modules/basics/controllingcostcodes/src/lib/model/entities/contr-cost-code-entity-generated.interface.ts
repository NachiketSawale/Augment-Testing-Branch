/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IAccount2MdcContrCostEntity } from './account-2mdc-contr-cost-entity.interface';
import { IContrCostCodeEntity } from './contr-cost-code-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IContrCostCodeEntityGenerated extends IEntityBase {

/*
 * Account2MdcContrCostEntities
 */
  Account2MdcContrCostEntities?: IAccount2MdcContrCostEntity[] | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * ContrCostCodeChildrens
 */
  ContrCostCodeChildrens?: IContrCostCodeEntity[] | null;

/*
 * ContrCostCodeParent
 */
  ContrCostCodeParent?: IContrCostCodeEntity | null;

/*
 * ContrCostCodeParentFk
 */
  ContrCostCodeParentFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsCostPrr
 */
  IsCostPrr?: boolean | null;

/*
 * IsRevenue
 */
  IsRevenue?: boolean | null;

/*
 * IsRevenuePrr
 */
  IsRevenuePrr?: boolean | null;

/*
 * MdcContextFk
 */
  MdcContextFk?: number | null;

/*
 * RevenueInt
 */
  RevenueInt?: number | null;

/*
 * UomFk
 */
  UomFk?: number | null;
}
