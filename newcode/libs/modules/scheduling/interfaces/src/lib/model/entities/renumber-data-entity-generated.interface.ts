/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ISortDataEntity } from './sort-data-entity.interface';

export interface IRenumberDataEntityGenerated {

/*
 * CodeFormatFk
 */
  CodeFormatFk?: number | null;

/*
 * IsTestRun
 */
  IsTestRun?: boolean | null;

/*
 * SortLevels
 */
  SortLevels?: ISortDataEntity[] | null;
}
