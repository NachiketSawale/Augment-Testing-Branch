/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPPSItemEntity } from './pps-item-entity.interface';
import {IEntityBase} from '@libs/platform/common';

export interface IGroupItemReqeustGenerated {

/*
 * config
 */
  config?: IEntityBase | null;

/*
 * eventTypeSeqs
 */
  eventTypeSeqs?: IEntityBase[] | null;

/*
 * selectedItems
 */
  selectedItems?: IPPSItemEntity[] | null;
}
