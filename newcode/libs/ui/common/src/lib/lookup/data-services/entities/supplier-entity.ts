/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Supplier entity
 */
export class SupplierEntity {
    public Description?: string;
    public BusinessPartnerName1?: string;
    public AddressLine?: string;

    public constructor(public Id: number, public Code: string) {

    }
}