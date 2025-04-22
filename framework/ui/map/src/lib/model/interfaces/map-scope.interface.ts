/**
 * Copyright(c) RIB Software GmbH
 */
import { IAddressEntity } from './address-entity.interface';


/**
 * Interface that store map option object.
 */
export interface IMapScope{
    
    /**
     * Address entity.
     */
    entity:IAddressEntity[]|IAddressEntity;

    /**
     * Show route flag.
     */
    showRoutes:boolean;

    /**
     * Calculate distance flag.
     */
    calculateDist:boolean;
}