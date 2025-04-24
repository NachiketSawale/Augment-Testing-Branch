/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPpsCostCodeEntityGenerated extends IEntityBase {

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * MdcCode
 */
  MdcCode?: string | null;

/*
 * MdcCostCodeFk
 */
  MdcCostCodeFk: number;

/*
 * MdcDes
 */
  MdcDes?: string | null;

/*
 * NewTksTimeSymbolFk
 */
  NewTksTimeSymbolFk?: number | null;

/*
 * ShowAsSlotOnProduct
 */
  ShowAsSlotOnProduct: boolean;

/*
 * TksTimeSymbolFk
 */
  TksTimeSymbolFk: number;

/*
 * UseToCreateComponents
 */
  UseToCreateComponents: boolean;

/*
 * UseToUpdatePhaseReq
 */
  UseToUpdatePhaseReq: boolean;

/*
 * UserDefined1
 */
  UserDefined1?: string | null;

/*
 * UserDefined2
 */
  UserDefined2?: string | null;

/*
 * UserDefined3
 */
  UserDefined3?: string | null;

/*
 * UserDefined4
 */
  UserDefined4?: string | null;

/*
 * UserDefined5
 */
  UserDefined5?: string | null;
}
