/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBisPrjHistoryEntity } from '../models';

export interface IBisPaActivityEntityGenerated extends IEntityBase {

/*
 * ActivityCalendar
 */
  ActivityCalendar?: string | null;

/*
 * ActivityCode
 */
  ActivityCode: string;

/*
 * ActivityDesc
 */
  ActivityDesc?: string | null;

/*
 * ActivityDocCode
 */
  ActivityDocCode: string;

/*
 * ActivityDocVersion
 */
  ActivityDocVersion: number;

/*
 * ActivityDuration
 */
  ActivityDuration?: number | null;

/*
 * ActivityEnd
 */
  ActivityEnd?: string | null;

/*
 * ActivityId
 */
  ActivityId: string;

/*
 * ActivityIsCritical
 */
  ActivityIsCritical: boolean;

/*
 * ActivityIsSummaryactivity
 */
  ActivityIsSummaryactivity: boolean;

/*
 * ActivityParentDesc
 */
  ActivityParentDesc?: string | null;

/*
 * ActivityParentId
 */
  ActivityParentId?: string | null;

/*
 * ActivityStart
 */
  ActivityStart?: string | null;

/*
 * ActivityType
 */
  ActivityType?: string | null;

/*
 * BisPrjHistoryEntity
 */
  BisPrjHistoryEntity?: IBisPrjHistoryEntity | null;

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
