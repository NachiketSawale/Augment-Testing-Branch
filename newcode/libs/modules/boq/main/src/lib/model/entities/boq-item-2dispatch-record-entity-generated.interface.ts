/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBoqHeaderEntity } from '@libs/boq/interfaces';

export interface IBoqItem2DispatchRecordEntityGenerated extends IEntityBase {

/*
 * BoqHeaderEntity
 */
  BoqHeaderEntity?: IBoqHeaderEntity | null;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * BoqItemFk
 */
  BoqItemFk: number;

/*
 * DispatchRecordDateEffective
 */
  DispatchRecordDateEffective?: number | null;

/*
 * DispatchRecordFk
 */
  DispatchRecordFk: number;

/*
 * DispatchRecordHeaderCode
 */
  DispatchRecordHeaderCode?: number | null;

/*
 * DispatchRecordHeaderDescr
 */
  DispatchRecordHeaderDescr?: number | null;

/*
 * DispatchRecordNumber
 */
  DispatchRecordNumber?: number | null;

/*
 * DispatchRecordProductCode
 */
  DispatchRecordProductCode?: number | null;

/*
 * DispatchRecordProductDescr
 */
  DispatchRecordProductDescr?: number | null;

/*
 * DispatchRecordQuantity
 */
  DispatchRecordQuantity?: number | null;

/*
 * EngProdComponentFk
 */
  EngProdComponentFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * Quantity
 */
  Quantity: number;

/*
 * Userdefiend1
 */
  Userdefiend1?: string | null;

/*
 * Userdefined2
 */
  Userdefined2?: string | null;

/*
 * Userdefined3
 */
  Userdefined3?: string | null;
}
