/**
 * Copyright(c) RIB Software GmbH
 */

import { IEventMetadata } from './event-metadata.interface';

/**
 * An interface that stores bing event target object.
 */
export interface IEventTarget{

    /**
     * Metadata
     */
    metadata:IEventMetadata;

    /**
     * GetLocation
     * @returns string.
     */
    getLocation:()=>string;
}