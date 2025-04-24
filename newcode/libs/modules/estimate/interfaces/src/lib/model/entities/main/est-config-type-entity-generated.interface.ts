/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstConfigEntity } from './est-config-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IEstHeaderEntity } from './est-header-base-entity.interface';

export interface IEstConfigTypeEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstConfigEntity
 */
  EstConfigEntity?: IEstConfigEntity | null;

/*
 * EstConfigFk
 */
  EstConfigFk?: number | null;

/*
 * EstHeaderEntities
 */
  EstHeaderEntities?: IEstHeaderEntity[] | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDefault
 */
  IsDefault?: boolean | null;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * MdcContextFk
 */
  MdcContextFk?: number | null;
}
