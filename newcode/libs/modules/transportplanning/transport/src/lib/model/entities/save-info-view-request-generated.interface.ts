/*
 * Copyright(c) RIB Software GmbH
 */

import { ITrsRouteEntity } from './trs-route-entity.interface';
import { ITrsWaypointEntity } from './trs-waypoint-entity.interface';

export interface ISaveInfoViewRequestGenerated {

  /**
   * Packages
   */
  //?: ITransportPackageEntity[] | null;

  /**
   * Route
   */
  Route?: ITrsRouteEntity | null;

  /**
   * Waypoints
   */
  Waypoints?: ITrsWaypointEntity[] | null;
}
