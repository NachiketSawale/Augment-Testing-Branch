/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityEntity } from './activity-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IActivityTypeEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * PsdActivityEntities
 */
  PsdActivityEntities?: IActivityEntity[] | null;

/*
 * Remark
 */
  Remark?: string | null;
}
