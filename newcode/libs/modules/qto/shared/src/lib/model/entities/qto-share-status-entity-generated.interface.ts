/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import {IQtoShareHeaderEntity} from './qto-share-header-entity.interface';
import {IQtoShareStatusHistoryEntity} from './qto-share-status-history-entity.interface';

export interface IQtoShareStatusEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Icon
 */
  Icon: number;

/*
 * Id
 */
  Id: number;

/*
 * IsDefault
 */
  IsDefault: boolean;

/*
 * IsLive
 */
  IsLive: boolean;

/*
 * IsReadOnly
 */
  IsReadOnly: boolean;

/*
 * QtoHeaderEntities
 */
  QtoHeaderEntities?: IQtoShareHeaderEntity[] | null;

/*
 * QtoStatusHistoryEntities_QtoStatusNewFk
 */
  QtoStatusHistoryEntities_QtoStatusNewFk?: IQtoShareStatusHistoryEntity[] | null;

/*
 * QtoStatusHistoryEntities_QtoStatusOldFk
 */
  QtoStatusHistoryEntities_QtoStatusOldFk?: IQtoShareStatusHistoryEntity[] | null;

/*
 * Sorting
 */
  Sorting: number;
}
