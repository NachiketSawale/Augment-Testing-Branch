/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IActivityEntity } from './activity-entity.interface';
import { IActivity2ModelObjectEntity } from './activity-2model-object-entity.interface';

export interface ICalculateActivity2ModelObjectEntityGenerated {

/*
 * Activity
 */
  Activity?: IActivityEntity | null;

/*
 * Activity2ModelObject
 */
  Activity2ModelObject?: IActivity2ModelObjectEntity | null;

/*
 * Duration
 */
  Duration?: number | null;

/*
 * EndDate
 */
  EndDate?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * StartDate
 */
  StartDate?: string | null;

/*
 * Valid
 */
  Valid?: boolean | null;

/*
 * ValidationMessage
 */
  ValidationMessage?: string | null;
}
