/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBisPrjHistoryEntity } from '../models';

export interface IBisPaCoDataConfigEntityGenerated extends IEntityBase {

/*
 * BisPrjHistoryEntity
 */
  BisPrjHistoryEntity?: IBisPrjHistoryEntity | null;

/*
 * ConfClassification1
 */
  ConfClassification1?: string | null;

/*
 * ConfClassification2
 */
  ConfClassification2?: string | null;

/*
 * ConfClassification3
 */
  ConfClassification3?: string | null;

/*
 * ConfClassification4
 */
  ConfClassification4?: string | null;

/*
 * ConfTimeintervall
 */
  ConfTimeintervall?: string | null;

/*
 * HistoryFk
 */
  HistoryFk: number;

/*
 * RibPaId
 */
  RibPaId: string;
}
