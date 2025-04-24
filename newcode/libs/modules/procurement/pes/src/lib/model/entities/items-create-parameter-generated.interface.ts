/*
 * Copyright(c) RIB Software GmbH
 */

export interface IItemsCreateParameterGenerated {

  /**
   * ConHeaderFk
   */
  ConHeaderFk?: number | null;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * ExcludeInstanceIds
   */
  ExcludeInstanceIds?: number[] | null;

  /**
   * IsIncludeNonContractedPesItems
   */
  IsIncludeNonContractedPesItems: boolean;

  /**
   * MainItemId
   */
  MainItemId: number;

  /**
   * MaxItemNo
   */
  MaxItemNo: number;

  /**
   * PackageFk
   */
  PackageFk?: number | null;

  /**
   * PrcItemIds
   */
  PrcItemIds?: number[] | null;

  /**
   * ProjectFk
   */
  ProjectFk?: number | null;
}
