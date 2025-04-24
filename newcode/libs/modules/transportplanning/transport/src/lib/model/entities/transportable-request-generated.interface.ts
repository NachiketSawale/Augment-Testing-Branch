/*
 * Copyright(c) RIB Software GmbH
 */

import { ITrsRouteEntity } from './trs-route-entity.interface';

export interface ITransportableRequestGenerated {

  /**
   * BundleIds
   */
  BundleIds?: number[] | null;

  /**
   * IntervalHours
   */
  IntervalHours: number;

  /**
   * ProductIds
   */
  ProductIds?: number[] | null;

  /**
   * TrsRoute
   */
  TrsRoute?: ITrsRouteEntity | null;

  /**
   * UpstreamItemIds
   */
  UpstreamItemIds?: number[] | null;
}
