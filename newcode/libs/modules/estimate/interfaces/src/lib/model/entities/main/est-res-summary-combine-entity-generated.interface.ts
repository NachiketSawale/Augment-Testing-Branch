/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstResourceSummaryConfigEntity } from './est-resource-summary-config-entity.interface';
import { IEstResSummaryExceptionKeyEntity } from './est-res-summary-exception-key-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstResSummaryCombineEntityGenerated extends IEntityBase {

/*
 * ColumnId
 */
  ColumnId?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstResourceSummaryConfigEntity
 */
  EstResourceSummaryConfigEntity?: IEstResourceSummaryConfigEntity | null;

/*
 * EstResourceSummaryConfigFk
 */
  EstResourceSummaryConfigFk?: number | null;

/*
 * ExceptionKeyValues
 */
  ExceptionKeyValues?: IEstResSummaryExceptionKeyEntity[] | null;

/*
 * ExceptionKeys
 */
  ExceptionKeys?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsModified
 */
  IsModified?: boolean | null;

/*
 * Sorting
 */
  Sorting?: number | null;

/*
 * ToBeDeleted
 */
  ToBeDeleted?: boolean | null;
}
