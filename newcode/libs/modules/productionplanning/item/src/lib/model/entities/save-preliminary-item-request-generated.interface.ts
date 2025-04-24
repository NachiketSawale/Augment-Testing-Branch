/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IPPSItemEntity } from './pps-item-entity.interface';

export interface ISavePreliminaryItemRequestGenerated {

/*
 * PreliminaryItems
 */
  PreliminaryItems?: IPPSItemEntity[] | null;

/*
 * Probability
 */
  Probability?: number | null;

/*
 * Threshold
 */
  Threshold?: number | null;
}
