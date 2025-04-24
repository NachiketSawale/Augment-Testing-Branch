/*
 * Copyright(c) RIB Software GmbH
 */

export interface IUpdateVersionBoqEntityGenerated {

  /**
   * BaseBoqHeaderIds
   */
  BaseBoqHeaderIds?: number[] | null;

  /**
   * MainItemId
   */
  MainItemId: number;

  /**
   * TargetModules
   */
  TargetModules?: string[] | null;

  /**
   * UpdateFields
   */
  UpdateFields?: string[] | null;

  /**
   * UpdateMode
   */
  UpdateMode: number;
}
