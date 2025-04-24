/*
 * Copyright(c) RIB Software GmbH
 */
import {ICartCatalogEntity, ICartItemEntity} from './interfaces/cart-item-entity.interface';

/**
 * Cart item response model
 */
export class ProcurementTicketSystemCartItemResponse {
    /**
     * cart list
     */
    public cartList: ICartItemEntity[] = [];

    /**
     * catalog list
     */
    public catalogs: ICartCatalogEntity[] = [];

    /**
     * home Currency
     */
    public homeCurrency: string = '';

    /**
     * cart count
     */
    public cartCount: number = 0;

    /**
     * cart total
     */
    public cartTotal: number | string = 0;

    /**
     * select Cart Count
     */
    public selectCartCount: number = 0;

}

/**
 * Cart item response from http
 */
export class ProcurementTicketSystemCartItemHttpResponse {
    /**
     * HomeCurrency
     */
    public HomeCurrency: string = '';

    /**
     * Order Request entities
     */
    public Items: ICartItemEntity[] = [];
}
