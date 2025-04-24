/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMdcAllowanceEntity } from './mdc-allowance-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IMdcAllMarkup2CostCodeEntityGenerated extends IEntityBase {

/*
 * CostCode
 */
  CostCode?: string | null;

/*
 * CostCodeMainId
 */
  CostCodeMainId?: number | null;

/*
 * CostCodeParentFk
 */
  CostCodeParentFk?: number | null;

/*
 * CostCodes
 */
 // CostCodes?: IICostCodeEntity[] | null;

/*
 * Id
 */
  Id: number;

/*
 * MarkupAm
 */
  MarkupAm?: number | null;

/*
 * MarkupGa
 */
  MarkupGa?: number | null;

/*
 * MarkupRp
 */
  MarkupRp?: number | null;

/*
 * MdcAllowanceAreaFk
 */
  MdcAllowanceAreaFk?: number | null;

/*
 * MdcAllowanceEntity
 */
  MdcAllowanceEntity?: IMdcAllowanceEntity | null;

/*
 * MdcAllowanceFk
 */
  MdcAllowanceFk?: number | null;

/*
 * MdcCostCodeFk
 */
  MdcCostCodeFk?: number | null;
}
