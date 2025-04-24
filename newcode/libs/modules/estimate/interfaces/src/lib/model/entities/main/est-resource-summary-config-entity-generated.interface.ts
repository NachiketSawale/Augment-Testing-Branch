/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstResSummaryCombineEntity } from './est-res-summary-combine-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstResourceSummaryConfigEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstResSummaryCombineEntities
 */
  EstResSummaryCombineEntities?: IEstResSummaryCombineEntity[] | null;

/*
 * FrmAccessRoleFk
 */
  FrmAccessRoleFk?: number | null;

/*
 * FrmUserFk
 */
  FrmUserFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IsModified
 */
  IsModified?: boolean | null;

/*
 * IsSystem
 */
  IsSystem?: boolean | null;

/*
 * ToBeDeleted
 */
  ToBeDeleted?: boolean | null;
}
