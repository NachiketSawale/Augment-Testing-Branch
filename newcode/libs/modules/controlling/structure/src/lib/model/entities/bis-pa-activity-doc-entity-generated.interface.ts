/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBisPrjHistoryEntity } from '../models';

export interface IBisPaActivityDocEntityGenerated extends IEntityBase {

/*
 * ActivityDocCode
 */
  ActivityDocCode: string;

/*
 * ActivityDocDesc
 */
  ActivityDocDesc?: string | null;

/*
 * ActivityDocIsActive
 */
  ActivityDocIsActive: boolean;

/*
 * ActivityDocIsDisabled
 */
  ActivityDocIsDisabled: boolean;

/*
 * ActivityDocIsTarget
 */
  ActivityDocIsTarget: boolean;

/*
 * ActivityDocVersion
 */
  ActivityDocVersion: number;

/*
 * BisPrjHistoryEntity
 */
  BisPrjHistoryEntity?: IBisPrjHistoryEntity | null;

/*
 * HistoryFk
 */
  HistoryFk: number;

/*
 * RibPaId
 */
  RibPaId: string;
}
