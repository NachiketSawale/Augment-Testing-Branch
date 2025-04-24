/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstUppConfigEntity } from './est-upp-config-entity.interface';
import { IEstUppConfigTypeEntity } from './est-upp-config-type-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IEstHeaderEntity } from './est-header-base-entity.interface';

export interface IEstBoq2uppConfigEntityGenerated extends IEntityBase {

/*
 * BoqHeaderFk
 */
  BoqHeaderFk?: number | null;

/*
 * EstHeaderEntity
 */
  EstHeaderEntity?: IEstHeaderEntity | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstUppConfigEntity
 */
  EstUppConfigEntity?: IEstUppConfigEntity | null;

/*
 * EstUppConfigFk
 */
  EstUppConfigFk?: number | null;

/*
 * EstUppConfigTypeEntity
 */
  EstUppConfigTypeEntity?: IEstUppConfigTypeEntity | null;

/*
 * EstUppConfigtypeFk
 */
  EstUppConfigtypeFk?: number | null;

/*
 * Id
 */
  Id: number;
}
