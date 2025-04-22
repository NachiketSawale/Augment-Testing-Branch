/**
 * Copyright(c) RIB Software GmbH
 */
import { IRouteLeg } from './route-leg.interface';

/**
 * An interface that stores google map route object.
 */
export interface IGoogleMapRoute{
    /**
     * Route legs.
     */
    legs:IRouteLeg[];
}