/*
 * Copyright(c) RIB Software GmbH
 */
/**
 * Submit Entity
 */
export interface ISubmitEntity {
    ProjectFK: number
    AddressFK?: number;
    DateRequire?: Date;
    StructureFK: number;
    PrcType?: number;
    ClerkFK?: number;
    ClerkResponsibleFK?: number;
    ControllingUnitFk?: number;
    CompanyId?: number;
    Description?: string;
    CreateSeparateContractForEachItem?: boolean;
    hasContract?: boolean;
    Groups: ISubmitGroupEntity[],
    Remark?: string,
	PriceConditions?: number[],
	PriceListConditions?: number[]
}
/**
 * Submit Group Entity
 */
export interface ISubmitGroupEntity {
    Type?: number
    BusinessPartnerId?: number;
    DateRequire: Date;
    MaterialIds?: number[];
    ConfigurationFk?: number;
}
/**
 * address
 */
export interface IAddressEntity {
    Id?: number
}
/**
 * Submit Response Entity
 */
export interface ISubmitResponseEntity {
    Id: number;
    Code: string;
    Description: string;
    ProjectId: number;
    BusinessPartnerId: number;
}
/**
 * Submit cart item Entity
 */
export interface IProcurementCartItemVEntity {
    Id: number;
}
/**
 * Configuration Entity
 */
export interface IProcurementConfigurationEntity {
    Id: number;
}