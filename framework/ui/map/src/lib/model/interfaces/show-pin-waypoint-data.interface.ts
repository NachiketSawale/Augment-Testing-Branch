/**
 * Copyright(c) RIB Software GmbH
 */
import { IAddressEntity } from './address-entity.interface';

/**
 *  An interface that stores show pin way point object.
 */
export interface IShowPinWaypointData{
    
    /**
     * PlannedTime.
     */
    PlannedTime:Date | string | number;

    /**
     * Address.
     */
    Address:IAddressEntity;

    /**
     * Code.
     */
    Code:string | null;

    /**
     * CommentText.
     */
    CommentText:string | null;

    /**
     * Id.
     */
    Id:number;
}