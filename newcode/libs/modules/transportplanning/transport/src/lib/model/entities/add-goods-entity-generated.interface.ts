/*
 * Copyright(c) RIB Software GmbH
 */

import { ITrsRouteEntity } from './trs-route-entity.interface';

export interface IAddGoodsEntityGenerated {

  /**
   * Bundles
   */
  //Bundles?: IPackageInfo[] | null;

  /**
   * DstWPFk
   */
  DstWPFk: number;

  /**
   * Materials
   */
  //Materials?: IPackageInfo[] | null;

  /**
   * Plants
   */
 // Plants?: IPackageInfo[] | null;

  /**
   * Products
   */
  //Products?: IPackageInfo[] | null;

  /**
   * ResReservations
   */
  //ResReservations?: IPackageInfo[] | null;

  /**
   * Resources
   */
  //Resources?: IPackageInfo[] | null;

  /**
   * Route
   */
  Route?: ITrsRouteEntity | null;

  /**
   * SrcWPFk
   */
  SrcWPFk: number;

  /**
   * TransportRequisitionId
   */
  TransportRequisitionId?: number | null;
}
