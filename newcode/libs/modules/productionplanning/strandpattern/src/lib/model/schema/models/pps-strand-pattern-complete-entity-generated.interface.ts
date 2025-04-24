/*
 * Copyright(c) RIB Software GmbH
 */

import { IPpsStrandPatternEntity } from './pps-strand-pattern-entity-].interface';
import { IPpsStrandPattern2MaterialEntity } from './pps-strand-pattern-2material-entity.interface';

export interface IPpsStrandPatternCompleteEntityGenerated {
  MainItemId?: number;
  StrandPattern?: Array<IPpsStrandPatternEntity>;
  StrandPattern2MaterialToDelete?: Array<IPpsStrandPattern2MaterialEntity>;
  StrandPattern2MaterialToSave?: Array<IPpsStrandPattern2MaterialEntity>;
}
