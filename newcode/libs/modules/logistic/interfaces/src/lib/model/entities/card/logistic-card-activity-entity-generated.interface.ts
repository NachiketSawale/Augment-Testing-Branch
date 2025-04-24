/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ILogisticCardActClerkEntity } from './logistic-card-act-clerk-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ILogisticCardActivityEntityGenerated extends IEntityBase {

/*
 * ActualStartDate
 */
  ActualStartDate?: string | null;

/*
 * ActualStopDate
 */
  ActualStopDate?: string | null;

/*
 * ClerkFk
 */
  ClerkFk?: number | null;

/*
 * Code
 */
  Code: string;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * ControllingUnitFk
 */
  ControllingUnitFk?: number | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDone
 */
  IsDone: boolean;

/*
 * JobCardAreaFk
 */
  JobCardAreaFk?: number | null;

/*
 * JobCardFk
 */
  JobCardFk: number;

/*
 * LgmJobcardactclerkEntities
 */
  LgmJobcardactclerkEntities?: ILogisticCardActClerkEntity[] | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * Remark
 */
  Remark?: string | null;
}
