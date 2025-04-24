/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import {IQtoShareHeaderEntity} from './qto-share-header-entity.interface';
import {IQtoShareStatusEntity} from './qto-share-status-entity.interface';

export interface IQtoShareStatusHistoryEntityGenerated extends IEntityBase {

/*
 * Id
 */
  Id: number;

/*
 * QtoHeaderEntity
 */
  QtoHeaderEntity?: IQtoShareHeaderEntity | null;

/*
 * QtoHeaderFk
 */
  QtoHeaderFk: number;

/*
 * QtoStatusEntity_QtoStatusNewFk
 */
  QtoStatusEntity_QtoStatusNewFk?: IQtoShareStatusEntity | null;

/*
 * QtoStatusEntity_QtoStatusOldFk
 */
  QtoStatusEntity_QtoStatusOldFk?: IQtoShareStatusEntity | null;

/*
 * QtoStatusNewFk
 */
  QtoStatusNewFk: number;

/*
 * QtoStatusOldFk
 */
  QtoStatusOldFk: number;

/*
 * Remark
 */
  Remark?: string | null;
}
