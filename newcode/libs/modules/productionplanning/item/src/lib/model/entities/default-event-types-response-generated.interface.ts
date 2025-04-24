/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {IEntityBase} from '@libs/platform/common';

export interface IDefaultEventTypesResponseGenerated {

/*
 * DefaultEventTypes
 */
  DefaultEventTypes?: {[key: string]: number} | null;

/*
 * SelectedItemEventTypes
 */
  SelectedItemEventTypes?: IEntityBase[] | null;
}
