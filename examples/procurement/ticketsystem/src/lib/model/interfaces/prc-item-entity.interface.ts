/*
 * Copyright(c) RIB Software GmbH
 */
/**
 * PrcItem Entity returns from order request http
 */
export interface IPrcItemEntity {
    Id: number;
    BasMaterialCurrencyDescription: string;
    BasMaterialPrice: number;
    Quantity: number;
    PriceUnit: number;
    Image: string;
    Description1: string;
    Supplierreference: string;
    Total: number;
    BasUom: string;
    MdcMaterialFk: number;
}