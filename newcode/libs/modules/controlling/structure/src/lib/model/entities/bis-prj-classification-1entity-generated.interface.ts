/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBisPrjHistoryEntity } from '../models';

export interface IBisPrjClassification1EntityGenerated extends IEntityBase {

/*
 * BisPrjHistoryEntity
 */
  BisPrjHistoryEntity?: IBisPrjHistoryEntity | null;

/*
 * ClasCatologDesc
 */
  ClasCatologDesc?: string | null;

/*
 * ClasCatologId
 */
  ClasCatologId: string;

/*
 * ClasDesc
 */
  ClasDesc?: string | null;

/*
 * ClasId
 */
  ClasId: string;

/*
 * ClasLocked
 */
  ClasLocked: boolean;

/*
 * ClasParentDesc
 */
  ClasParentDesc?: string | null;

/*
 * ClasParentId
 */
  ClasParentId?: string | null;

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
