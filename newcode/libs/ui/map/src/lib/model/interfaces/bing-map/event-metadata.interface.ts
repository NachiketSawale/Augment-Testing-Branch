/**
 * Copyright(c) RIB Software GmbH
 */

import { IAddressEntity } from '../address-entity.interface';

/**
 * An interface that stores bing event metadata object.
 */
export interface IEventMetadata{
    /**
     * Entity.
     */
    entity:IAddressEntity;

    /**
     * InfoboxOffset
     */
    infoboxOffset:object;
}