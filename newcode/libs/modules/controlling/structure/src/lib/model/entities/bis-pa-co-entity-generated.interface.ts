/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBisPrjHistoryEntity } from '../models';

export interface IBisPaCoEntityGenerated extends IEntityBase {

/*
 * BisPrjHistoryEntity
 */
  BisPrjHistoryEntity?: IBisPrjHistoryEntity | null;

/*
 * CoDesc
 */
  CoDesc?: string | null;

/*
 * CoId
 */
  CoId: string;

/*
 * CoLocked
 */
  CoLocked: boolean;

/*
 * CoParentDesc
 */
  CoParentDesc?: string | null;

/*
 * CoParentId
 */
  CoParentId?: string | null;

/*
 * HistoryFk
 */
  HistoryFk: number;

/*
 * Level1Id
 */
  Level1Id?: string | null;

/*
 * Level2Id
 */
  Level2Id?: string | null;

/*
 * Level3Id
 */
  Level3Id?: string | null;

/*
 * Level4Id
 */
  Level4Id?: string | null;

/*
 * Level5Id
 */
  Level5Id?: string | null;

/*
 * Level6Id
 */
  Level6Id?: string | null;

/*
 * Level7Id
 */
  Level7Id?: string | null;

/*
 * Level8Id
 */
  Level8Id?: string | null;

/*
 * RibPaId
 */
  RibPaId: string;
}
