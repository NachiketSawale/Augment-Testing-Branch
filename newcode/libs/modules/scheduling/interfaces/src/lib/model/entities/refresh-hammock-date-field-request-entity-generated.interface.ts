/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IHammockActivityEntity } from './hammock-activity-entity.interface';
import { IActivityEntity } from './activity-entity.interface';

export interface IRefreshHammockDateFieldRequestEntityGenerated {

/*
 * deletedHammocks
 */
  deletedHammocks?: IHammockActivityEntity[] | null;

/*
 * hammockActivity
 */
  hammockActivity?: IActivityEntity | null;

/*
 * newHammocks
 */
  newHammocks?: IHammockActivityEntity[] | null;
}
