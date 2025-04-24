/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPpsUpstreamItemEntity } from './pps-upstream-item-entity.interface';
import {IEntityBase} from '@libs/platform/common';

export interface ISaveSplitUpstreamItemParamsGenerated {

/*
 * SelectedUpstreamItem
 */
  SelectedUpstreamItem?: IPpsUpstreamItemEntity | null;

/*
 * UpstreamItemInfos
 */
  UpstreamItemInfos?: IEntityBase[] | null;
}
