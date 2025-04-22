/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * The procurement header context which decides state and behavior of its sub containers such as procurement item container and so on
 */
export interface IPrcHeaderContext {
    prcHeaderFk: number;
    projectFk: number;
    currencyFk: number;
    exchangeRate: number;
	taxCodeFk?: number
    controllingUnitFk?: number | null;
    materialCatalogFk?: number;
    vatGroupFk?: number;
    paymentTermFiFk?: number;
    paymentTermPaFk?: number;
    incotermFk?: number;

    prcConfigFk?: number;
    structureFk?: number;

    businessPartnerFk?: number;
    dateOrdered?: Date | string;
    /**
     * readonly state for whole procurement header and its sub containers
     */
    readonly: boolean;
}