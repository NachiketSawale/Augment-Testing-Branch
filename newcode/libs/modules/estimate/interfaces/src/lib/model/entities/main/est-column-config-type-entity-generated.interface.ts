/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstConfigEntity } from './est-config-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstColumnConfigTypeEntityGenerated extends IEntityBase {

/*
 * ContextFk
 */
  ContextFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstColumnConfigFk
 */
  EstColumnConfigFk?: number | null;

/*
 * EstConfigEntities
 */
  EstConfigEntities?: IEstConfigEntity[] | null;

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
}
