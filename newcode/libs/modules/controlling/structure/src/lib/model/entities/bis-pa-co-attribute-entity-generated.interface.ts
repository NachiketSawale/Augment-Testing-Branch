/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBisPrjHistoryEntity } from '../models';

export interface IBisPaCoAttributeEntityGenerated extends IEntityBase {

/*
 * BisPrjHistoryEntity
 */
  BisPrjHistoryEntity?: IBisPrjHistoryEntity | null;

/*
 * CoAttrKeyDesc
 */
  CoAttrKeyDesc?: string | null;

/*
 * CoAttrKeyId
 */
  CoAttrKeyId: string;

/*
 * CoAttrValueDesc
 */
  CoAttrValueDesc?: string | null;

/*
 * CoAttrValueId
 */
  CoAttrValueId: string;

/*
 * CoId
 */
  CoId: string;

/*
 * HistoryFk
 */
  HistoryFk: number;

/*
 * RibPaId
 */
  RibPaId: string;
}
