/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstConfigEntity } from './est-config-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstColumnConfigEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstConfigEntities
 */
  EstConfigEntities?: IEstConfigEntity[] | null;

/*
 * Id
 */
  Id: number;
}
