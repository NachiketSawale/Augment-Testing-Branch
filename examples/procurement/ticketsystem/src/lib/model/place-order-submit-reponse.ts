/*
 * Copyright(c) RIB Software GmbH
 */

import {IProcurementCartItemVEntity, ISubmitResponseEntity} from './interfaces/submit-entity.interface';

/**
 * PlaceOrderResponse
 */
export class PlaceOrderResponseHttpResponse {
    /**
     * Type
     */
    public Type: number = 2;

    /**
     * Submit Response Entity
     */
    public Items: ISubmitResponseEntity[] = [];

    /**
     * Cart Item VEntity
     */
    public CartItems: IProcurementCartItemVEntity[] = [];
}


