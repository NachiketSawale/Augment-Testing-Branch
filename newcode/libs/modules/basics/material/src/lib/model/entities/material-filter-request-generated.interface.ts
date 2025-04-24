/*
 * Copyright(c) RIB Software GmbH
 */

import { IPinningContext } from '@libs/platform/common';

export interface IMaterialFilterRequestGenerated {

  /**
   * CatalogId
   */
  CatalogId?: number | null;

  /**
   * EnhancedFilterDef
   */
  EnhancedFilterDef?: string | null;

  /**
   * ExecutionHints
   */
  ExecutionHints?: boolean | null;

  /**
   * FurtherFilters
   */
  FurtherFilters?: number[] | null;

  /**
   * GroupIds
   */
  GroupIds?: number[] | null;

  /**
   * HasPinningContext
   */
  HasPinningContext: boolean;

  /**
   * IncludeNonActiveItems
   */
  IncludeNonActiveItems?: boolean | null;

  /**
   * IncludeResultIds
   */
  IncludeResultIds?: boolean | null;

  /**
   * InterfaceVersion
   */
  InterfaceVersion?: string | null;

  /**
   * IsEnhancedFilter
   */
  IsEnhancedFilter?: boolean | null;

  /**
   * IsRefresh
   */
  IsRefresh: boolean;

  /**
   * MaterialCatalogIds
   */
  MaterialCatalogIds?: number[] | null;

  /**
   * OrderBy
   */
  OrderBy?: number[] | null;

  /**
   * PKeys
   */
  PKeys?: number[] | null;

  /**
   * PageNumber
   */
  PageNumber?: number | null;

  /**
   * PageSize
   */
  PageSize?: number | null;

  /**
   * Pattern
   */
  Pattern?: string | null;

  /**
   * PinnedEnhancedFilter
   */
  PinnedEnhancedFilter?: string[] | null;

  /**
   * PinningContext
   */
  PinningContext?: IPinningContext[] | null;

  /**
   * ProjectContextId
   */
  ProjectContextId?: number | null;

  /**
   * UseCurrentClient
   */
  UseCurrentClient?: boolean | null;

  /**
   * UseCurrentProfitCenter
   */
  UseCurrentProfitCenter?: boolean | null;

  /**
   * groupingFilter
   */
  //groupingFilter?: IGroupingFilter | null;
}
