/*
 * Copyright(c) RIB Software GmbH
 */

import { ITrsRouteEntity } from './trs-route-entity.interface';

export interface IUpdateResourceRequestGenerated {

  /**
   * Route
   */
  Route?: ITrsRouteEntity | null;

  /**
   * Type
   */
  Type?: string | null;

  /**
   * Update
   */
  Update: boolean;
}
