/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase} from '@libs/platform/common';

export interface ICheckGroupResponseGenerated {

/*
 * eventInfo
 */
  eventInfo?: {[key: string]: {[key: string]: string}} | null;

/*
 * eventTypes
 */
  eventTypes?: IEntityBase[] | null;

/*
 * resultCode
 */
  resultCode?: number | null;
}
