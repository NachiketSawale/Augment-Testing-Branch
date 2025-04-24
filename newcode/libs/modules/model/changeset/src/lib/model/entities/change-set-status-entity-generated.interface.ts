/*
 * Copyright(c) RIB Software GmbH
 */

import { IChangeSetEntity } from './change-set-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IChangeSetStatusEntityGenerated extends IEntityBase {

/*
 * ChangeSetEntities
 */
  ChangeSetEntities?: IChangeSetEntity[] | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id?: number;
}
