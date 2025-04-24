/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBisPrjHistoryEntity } from '../models';

export interface IBisPaBoqEntityGenerated extends IEntityBase {

/*
 * BisPrjHistoryEntity
 */
  BisPrjHistoryEntity?: IBisPrjHistoryEntity | null;

/*
 * Cur
 */
  Cur?: string | null;

/*
 * HistoryFk
 */
  HistoryFk: number;

/*
 * Id
 */
  Id: string;

/*
 * IsBoq
 */
  IsBoq: boolean;

/*
 * IsBoqhierarchy
 */
  IsBoqhierarchy: boolean;

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
 * Name
 */
  Name: string;

/*
 * Outlinespec
 */
  Outlinespec?: string | null;

/*
 * ParentId
 */
  ParentId?: string | null;

/*
 * ParentOutlinespec
 */
  ParentOutlinespec?: string | null;

/*
 * RibPaId
 */
  RibPaId: string;

/*
 * Rn
 */
  Rn: string;

/*
 * Uom
 */
  Uom?: string | null;

/*
 * Ur
 */
  Ur?: number | null;
}
