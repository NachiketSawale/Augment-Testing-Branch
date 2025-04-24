/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { ILogisticCardActivityEntity } from './logistic-card-activity-entity.interface';
import { ILogisticCardEntity } from './logistic-card-entity.interface';

export interface ILogisticCardActClerkEntityGenerated extends IEntityBase {

/*
 * ClerkFk
 */
  ClerkFk: number;

/*
 * Finish
 */
  Finish?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * JobCardActivityEntity
 */
  JobCardActivityEntity?: ILogisticCardActivityEntity | null;

/*
 * JobCardActivityFk
 */
  JobCardActivityFk: number;

/*
 * JobCardEntity
 */
  JobCardEntity?: ILogisticCardEntity | null;

/*
 * JobCardFk
 */
  JobCardFk: number;

/*
 * Start
 */
  Start?: string | null;
}
