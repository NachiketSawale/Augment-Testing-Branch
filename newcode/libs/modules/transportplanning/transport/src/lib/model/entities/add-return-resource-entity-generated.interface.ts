/*
 * Copyright(c) RIB Software GmbH
 */

import { ITrsRouteEntity } from './trs-route-entity.interface';
import { ITrsWaypointEntity } from './trs-waypoint-entity.interface';

export interface IAddReturnResourceEntityGenerated {

  /**
   * ForUnplanned
   */
  ForUnplanned: boolean;

  /**
   * Resources
   */
  //Resources?: IReturnPackageInfo[] | null;

  /**
   * Route
   */
  Route?: ITrsRouteEntity | null;

  /**
   * Waypoint
   */
  Waypoint?: ITrsWaypointEntity | null;
}
