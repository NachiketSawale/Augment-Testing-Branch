/*
 * Copyright(c) RIB Software GmbH
 */

import { ITrsRouteEntity } from './trs-route-entity.interface';

export interface ICreateTrsRouteByTrsReqEntityGenerated {

  /**
   * Bundles
   */
  //Bundles?: IPackageInfoWithJob[] | null;

  /**
   * CreateWaypointForEachBundle
   */
  CreateWaypointForEachBundle: boolean;

  /**
   * DstJobFk
   */
  DstJobFk?: number | null;

  /**
   * IntervalHours
   */
  IntervalHours: number;

  /**
   * Materials
   */
  //Materials?: IPackageInfo[] | null;

  /**
   * Plants
   */
  //Plants?: IPackageInfo[] | null;

  /**
   * Products
   */
  //Products?: IPackageInfoWithJob[] | null;

  /**
   * ResReservations
   */
  //ResReservations?: IPackageInfo[] | null;

  /**
   * Resources
   */
  //Resources?: IReturnPackageInfo[] | null;

  /**
   * SrcJobFk
   */
  SrcJobFk?: number | null;

  /**
   * TransportRequisitionId
   */
  TransportRequisitionId?: number | null;

  /**
   * TrsRoute
   */
  TrsRoute?: ITrsRouteEntity | null;

  /**
   * UpdateDateByDeliveryDate
   */
  UpdateDateByDeliveryDate: boolean;
}
