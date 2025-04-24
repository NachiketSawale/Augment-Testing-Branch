/*
 * Copyright(c) RIB Software GmbH
 */

import { IStateFulDataItemEntity } from './state-ful-data-item-entity.interface';

export interface IGetAvailableStatusItemsEntityGenerated {
  AvailableStatus?: Array<IStateFulDataItemEntity>;
  DataItems?: Array<IStateFulDataItemEntity>;
  SelectedStatus?: Array<IStateFulDataItemEntity>;
  StatusName?: string;
}
