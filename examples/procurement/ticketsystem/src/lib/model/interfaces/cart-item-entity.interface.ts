/*
 * Copyright(c) RIB Software GmbH
 */
import {IMaterialSearchEntity} from '@libs/basics/shared';

/**
 * Cart Item Entity returns from cart item http
 */
export interface ICartItemEntity {
    Material: IMaterialSearchEntity
    Quantity: number;
    ExchangeRate: number;
    PriceListFk?: number;
    PrcType: number;
    catalogKey: string;
}
/**
 * Cart Catalog Entity show in view
 */
export interface ICartCatalogEntity {
    key: string;
    checked: boolean;
    businessPartnerFk?: number | null;
    configurationFk?: number | null;
    contactFk: number | null;
    prcType: number;
    requireDate: Date | null;
    isFrameworkType: boolean;
    collapsed: boolean;
    items: ICartItemEntity[]
}