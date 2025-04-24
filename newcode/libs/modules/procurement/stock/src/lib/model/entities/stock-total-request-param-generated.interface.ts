/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IStockTotalRequestParamGenerated {

/*
 * EnhancedFilterDef
 */
  EnhancedFilterDef?: string | null;

/*
 * ExecutionHints
 */
  ExecutionHints?: boolean | null;

/*
 * FurtherFilters
 */
  FurtherFilters?: number[] | null;

/*
 * HasPinningContext
 */
  HasPinningContext?: boolean | null;

/*
 * IncludeNonActiveItems
 */
  IncludeNonActiveItems?: boolean | null;

/*
 * IncludeResultIds
 */
  IncludeResultIds?: boolean | null;

/*
 * InterfaceVersion
 */
  InterfaceVersion?: string | null;

/*
 * IsEnhancedFilter
 */
  IsEnhancedFilter?: boolean | null;

/*
 * OrderBy
 */
  OrderBy?: number[] | null;

/*
 * PKeys
 */
  PKeys?: number[] | null;

/*
 * PageNumber
 */
  PageNumber?: number | null;

/*
 * PageSize
 */
  PageSize?: number | null;

/*
 * Pattern
 */
  Pattern?: string | null;

/*
 * PinnedEnhancedFilter
 */
  PinnedEnhancedFilter?: string[] | null;

/*
 * PinningContext
 */
  PinningContext?: number[] | null;

/*
 * PrjStockIds
 */
  PrjStockIds?: number[] | null;

/*
 * ProjectContextId
 */
  ProjectContextId?: number | null;

/*
 * UseCurrentClient
 */
  UseCurrentClient?: boolean | null;

/*
 * UseCurrentProfitCenter
 */
  UseCurrentProfitCenter?: boolean | null;

// /*
//  * groupingFilter
//  */
//   groupingFilter?: IGroupingFilter | null;
}
