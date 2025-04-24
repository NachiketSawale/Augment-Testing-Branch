/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBisPrjHistoryEntity } from '../models';

export interface IBisPaChangeorderEntityGenerated extends IEntityBase {

/*
 * BisPrjHistoryEntity
 */
  BisPrjHistoryEntity?: IBisPrjHistoryEntity | null;

/*
 * ChgordClientcono
 */
  ChgordClientcono?: string | null;

/*
 * ChgordDesc
 */
  ChgordDesc?: string | null;

/*
 * ChgordId
 */
  ChgordId: string;

/*
 * ChgordParentDesc
 */
  ChgordParentDesc?: string | null;

/*
 * ChgordParentId
 */
  ChgordParentId?: string | null;

/*
 * ChgordStatus
 */
  ChgordStatus?: string | null;

/*
 * ChgordVfactorAmount
 */
  ChgordVfactorAmount?: number | null;

/*
 * ChgordVfactorBestcase
 */
  ChgordVfactorBestcase?: number | null;

/*
 * ChgordVfactorReason
 */
  ChgordVfactorReason?: number | null;

/*
 * ChgordVfactorWorstcase
 */
  ChgordVfactorWorstcase?: number | null;

/*
 * HistoryFk
 */
  HistoryFk: number;

/*
 * Isapproved
 */
  Isapproved: boolean;

/*
 * RibPaId
 */
  RibPaId: string;
}
