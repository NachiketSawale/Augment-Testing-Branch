/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICustomLocation } from './custom-location.interface';
import { IPPSItemEntity } from './pps-item-entity.interface';
import {IEntityBase} from '@libs/platform/common';

export interface ISaveSplitItemRequestGenerated {

/*
 * AsChild
 */
  AsChild?: boolean | null;

/*
 * Info
 */
  Info?: IEntityBase | null;

/*
 * Locations
 */
  Locations?: ICustomLocation[] | null;

/*
 * SelectedItem
 */
  SelectedItem?: IPPSItemEntity | null;
}
