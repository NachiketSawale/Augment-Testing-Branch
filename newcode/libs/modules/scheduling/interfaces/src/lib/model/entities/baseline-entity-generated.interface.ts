/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityEntity } from './activity-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IBaselineEntityGenerated extends IEntityBase {

/*
 * BasCompanyFk
 */
  BasCompanyFk?: number | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * PsdActivityEntities
 */
  PsdActivityEntities?: IActivityEntity[] | null;

/*
 * PsdScheduleFk
 */
  PsdScheduleFk?: number | null;

/*
 * Remark
 */
  Remark?: string | null;
}
