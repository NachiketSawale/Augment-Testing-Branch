/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase} from '@libs/platform/common';

export interface ISaveSplitItemResponseGenerated {

/*
 * items
 */
  items?: IEntityBase[] | null;

/*
 * locationInfos
 */
  locationInfos?: IEntityBase[] | null;
}
