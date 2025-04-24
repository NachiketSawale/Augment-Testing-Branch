/*
 * Copyright(c) RIB Software GmbH
 */

export interface ICreateDispNoteParamGenerated {

  /**
   * CurrentRouteId
   */
  CurrentRouteId: number;

  /**
   * IsDraft
   */
  IsDraft: boolean;

  /**
   * RouteIds
   */
  RouteIds?: number[] | null;

  /**
   * WizParams
   */
  WizParams?: {[key: string]: string} | null;
}
