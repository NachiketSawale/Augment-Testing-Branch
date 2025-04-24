/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IEstHeaderEntity } from './est-header-base-entity.interface';

export interface IEstStatusHistoryEntityGenerated extends IEntityBase {

/*
 * EstHeaderEntity
 */
  EstHeaderEntity?: IEstHeaderEntity | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstStatusNewFk
 */
  EstStatusNewFk?: number | null;

/*
 * EstStatusOldFk
 */
  EstStatusOldFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * Remark
 */
  Remark?: string | null;
}
