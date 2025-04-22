/*
 * Copyright(c) RIB Software GmbH
 */

export interface IFilterOrdDataGenerated {

  /**
   * BillToFk
   */
  BillToFk?: number | null;

  /**
   * CheckFlag
   */
  CheckFlag: boolean;

  /**
   * Filter
   */
  Filter?: string | null;

  /**
   * IncludeRelatedHeader
   */
  IncludeRelatedHeader: boolean;

  /**
   * IsFilterByConStatus
   */
  IsFilterByConStatus: boolean;

  /**
   * PrjBoqFk
   */
  PrjBoqFk: number;

  /**
   * ProjectId
   */
  ProjectId: number;
}
