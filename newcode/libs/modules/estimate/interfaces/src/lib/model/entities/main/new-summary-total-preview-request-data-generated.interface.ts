/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstResourcesSummaryEntity } from './est-resources-summary-entity.interface';

export interface INewSummaryTotalPreviewRequestDataGenerated {

/*
 * param
 */
 //param?: IEstimateResourceSummaryFilterData | null;

/*
 * summaryDtos
 */
  summaryDtos?: IEstResourcesSummaryEntity[] | null;
}
