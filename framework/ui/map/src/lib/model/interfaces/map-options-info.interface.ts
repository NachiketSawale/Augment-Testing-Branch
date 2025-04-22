/**
 * Copyright(c) RIB Software GmbH
 */
import { IClassMapOptions } from './class-map-options.interface';

/**
 * An interface that stores google map options object.
 */
export interface IMapOptions{

    /**
     * Map options.
     */
    mapOptions:IClassMapOptions;

    /**
     * InfoBox flag.
     */
    showInfoBox:boolean;
}