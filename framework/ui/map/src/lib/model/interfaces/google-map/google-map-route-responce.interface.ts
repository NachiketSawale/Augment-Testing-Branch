/**
 * Copyright(c) RIB Software GmbH
 */
import { IGoogleMapRoute } from './google-map-route.interface';

/**
 * An interface that stores google map route object.
 */
export interface IGoogleMapRouteResponce{

    /**
     * Google map route.
     */
    routes:IGoogleMapRoute[]
}