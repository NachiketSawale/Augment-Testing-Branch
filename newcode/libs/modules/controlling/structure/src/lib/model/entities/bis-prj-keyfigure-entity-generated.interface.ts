/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBisPrjHistoryEntity } from '../models';

export interface IBisPrjKeyfigureEntityGenerated extends IEntityBase {

/*
 * BisPrjHistoryEntity
 */
  BisPrjHistoryEntity?: IBisPrjHistoryEntity | null;

/*
 * HistoryFk
 */
  HistoryFk: number;

/*
 * KfAttrKeyDesc
 */
  KfAttrKeyDesc?: string | null;

/*
 * KfAttrKeyId
 */
  KfAttrKeyId: string;

/*
 * KfAttrValueDesc
 */
  KfAttrValueDesc?: string | null;

/*
 * KfAttrValueId
 */
  KfAttrValueId?: string | null;

/*
 * RibPaId
 */
  RibPaId: string;
}
