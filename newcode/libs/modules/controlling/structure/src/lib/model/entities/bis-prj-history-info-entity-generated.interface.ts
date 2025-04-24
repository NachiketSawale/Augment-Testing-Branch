/*
 * Copyright(c) RIB Software GmbH
 */

import { IBisPrjHistoryEntity } from './bis-prj-history-entity.interface';
import { IBisDpTimeintervalEntity } from './bis-dp-timeinterval-entity.interface';

export interface IBisPrjHistoryInfoEntityGenerated {

/*
 * HistoryEntities
 */
  HistoryEntities?: IBisPrjHistoryEntity[] | null;

/*
 * LastHistoryEntity
 */
  LastHistoryEntity?: IBisPrjHistoryEntity | null;

/*
 * LastTimeinterval
 */
  LastTimeinterval?: IBisDpTimeintervalEntity | null;

/*
 * TimeintervalEntities
 */
  TimeintervalEntities?: IBisDpTimeintervalEntity[] | null;
}
