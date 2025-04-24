/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPPSItemEntity } from './pps-item-entity.interface';
import {IEntityBase} from '@libs/platform/common';

export interface ISplitItemRequestGenerated {

/*
 * config
 */
  config?: IEntityBase | null;

/*
 * parentItem
 */
  parentItem?: IPPSItemEntity | null;
}
