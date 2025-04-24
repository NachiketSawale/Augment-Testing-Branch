/*
 * Copyright(c) RIB Software GmbH
 */

import { IIdentificationData } from '@libs/platform/common';


export interface IStateFulDataItemEntityGenerated {
  AvailableStatusIds?: Array<number>;
  EntityId?: IIdentificationData;
  ProjectId?: number;
  StatusFrom?: number;
}
