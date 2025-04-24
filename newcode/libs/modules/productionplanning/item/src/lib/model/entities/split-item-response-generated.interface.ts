/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICustomLocation } from './custom-location.interface';
import {IEntityBase} from '@libs/platform/common';

export interface ISplitItemResponseGenerated {

/*
 * EventInfos
 */
  EventInfos?: {[key: string]: {[key: string]: string}} | null;

/*
 * Events
 */
  Events?: IEntityBase[] | null;

/*
 * Item2Events
 */
  Item2Events?: IEntityBase[] | null;

/*
 * Locations
 */
  Locations?: ICustomLocation[] | null;

/*
 * ProjectCalendarId
 */
  ProjectCalendarId?: number | null;

/*
 * Relations
 */
  Relations?: IEntityBase[] | null;

/*
 * RemainQuantity
 */
  RemainQuantity?: number | null;
}
