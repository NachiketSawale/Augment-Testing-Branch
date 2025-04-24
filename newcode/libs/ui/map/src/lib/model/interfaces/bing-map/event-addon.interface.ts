/**
 * Copyright(c) RIB Software GmbH
 */

import { IEventRoute } from './event-route.interface';

/**
 * An interface that stores bing event addon object.
 */
export interface IEventAddon{
    /**
     * Route.
     */
    route: IEventRoute[];
}