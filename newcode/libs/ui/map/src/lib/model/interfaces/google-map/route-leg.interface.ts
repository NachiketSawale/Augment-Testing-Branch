/**
 * Copyright(c) RIB Software GmbH
 */
import { IRouteLegDistance } from './route-leg-distance.interface';
import { IRouteLegEndLocation } from './route-leg-end-location.interface';

/**
 * An interface that stores route leg object.
 */
export interface IRouteLeg{
    /**
     * Route leg distance.
     */
    distance:IRouteLegDistance

    /**
     * Route leg distance.
     */
    end_location:IRouteLegEndLocation
}