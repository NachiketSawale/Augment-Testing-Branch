/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IUpdateMarkersRequestItemEntity } from './update-markers-request-item-entity.interface';

export interface IUpdateMarkersRequestEntityGenerated {

/*
 * Items
 */
  Items?: IUpdateMarkersRequestItemEntity[] | null;

/*
 * NewModelId
 */
  NewModelId?: number | null;
}
