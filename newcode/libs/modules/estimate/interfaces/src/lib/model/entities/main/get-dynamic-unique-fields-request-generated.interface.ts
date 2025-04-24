/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IGetDynamicUniqueFieldsRequestGenerated {

/*
 * EstimateScope
 */
  EstimateScope?: 'ALL_ESTIMATE' | 'RESULT_SET' | 'RESULT_HIGHLIGHTED' | null;

/*
 * FilterRequest
 */
  // FilterRequest?: IInt32 | null;

/*
 * LineItemIds
 */
  LineItemIds?: number[] | null;

/*
 * SourceType
 */
  SourceType?: number | null;
}
