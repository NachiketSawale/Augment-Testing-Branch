/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqItemEntity } from './boq-item-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IBoqCharacterContentEntityGenerated extends IEntityBase {

/*
 * BoqItemEntities_BoqCharacterContentPrjFk
 */
  BoqItemEntities_BoqCharacterContentPrjFk?: IBoqItemEntity[] | null;

/*
 * BoqItemEntities_BoqCharacterContentWorkFk
 */
  BoqItemEntities_BoqCharacterContentWorkFk?: IBoqItemEntity[] | null;

/*
 * Content
 */
  Content?: string | null;

/*
 * Id
 */
  Id: number;
}
