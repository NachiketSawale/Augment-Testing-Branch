/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqItemEntity } from '@libs/boq/interfaces';

export interface IGenerateWicNumberResponseEntityGenerated {

/*
 * ChangedRecords
 */
  ChangedRecords?: IBoqItemEntity[] | null;

/*
 * ChangedRecordsCount
 */
  ChangedRecordsCount?: number | null;

/*
 * Data
 */
  Data?: {[key: string]: unknown} | null;

/*
 * HelpDoc
 */
  HelpDoc?: string | null;

/*
 * IsSuccess
 */
  IsSuccess?: boolean | null;

/*
 * Message
 */
  Message?: string | null;

/*
 * TotalRecordsCount
 */
  TotalRecordsCount?: number | null;

/*
 * UnChangedRecords
 */
  UnChangedRecords?: IBoqItemEntity[] | null;
}
