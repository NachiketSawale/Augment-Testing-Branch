/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstResourcesSummaryEntity } from './est-resources-summary-entity.interface';

export interface IApplySummaryTotalRequestDataGenerated {

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstProjectFk
 */
  EstProjectFk?: number | null;

/*
 * requestData
 */
  requestData?: IEstResourcesSummaryEntity[] | null;
}
