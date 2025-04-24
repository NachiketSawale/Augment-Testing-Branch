/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IQtoSheetInterface } from './qto-sheet.interface';

export interface IQtoSheetEntityGenerated extends IEntityBase {

/*
 * Date
 */
  Date?: string | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * From
 */
  From?: number | null;

/*
 * HasChildren
 */
  HasChildren?: boolean | null;

/*
 * Id
 */
  Id: number;

/*
 * IsReadonly
 */
  IsReadonly: boolean;

/*
 * PageNumber
 */
  PageNumber?: number | null;

/*
 * QtoHeaderEntity
 */
  //QtoHeaderEntity?: IQtoMainHeaderGridEntity | null;

/*
 * QtoHeaderFk
 */
  QtoHeaderFk: number;

/*
 * QtoSheetChildren
 */
  QtoSheetChildren?: IQtoSheetInterface[] | null;

/*
 * QtoSheetFk
 */
  QtoSheetFk?: number | null;

/*
 * QtoSheetParent
 */
  QtoSheetParent?: IQtoSheetInterface | null;

/*
 * QtoSheetStatusFk
 */
  QtoSheetStatusFk: number;

/*
 * QtoSheets
 */
  QtoSheets?: IQtoSheetInterface[] | null;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * To
 */
  To?: number | null;
}
