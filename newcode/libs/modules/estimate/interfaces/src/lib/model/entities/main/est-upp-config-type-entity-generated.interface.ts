/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstBoq2uppConfigEntity } from './est-boq-2upp-config-entity.interface';
import { IEstUppConfigEntity } from './est-upp-config-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IEstUppConfigTypeEntityGenerated extends IEntityBase {

/*
 * ContextFk
 */
  ContextFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstBoq2uppConfigEntities
 */
  EstBoq2uppConfigEntities?: IEstBoq2uppConfigEntity[] | null;

/*
 * EstUppConfigEntity
 */
  EstUppConfigEntity?: IEstUppConfigEntity | null;

/*
 * EstUppConfigFk
 */
  EstUppConfigFk?: number | null;

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
