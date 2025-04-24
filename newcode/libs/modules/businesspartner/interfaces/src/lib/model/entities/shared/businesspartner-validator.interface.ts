/*
 * Copyright(c) RIB Software GmbH
 */


import { ILookupSearchRequest } from '@libs/ui/common';
import { BaseValidationService, IEntityRuntimeDataRegistry, ValidationResult } from '@libs/platform/data-access';
import { InjectionToken } from '@angular/core';

export interface IAdditionalParameters<T extends object> {
    [key: string]: (entity: T) => number | boolean;
}

export interface ILookupBPSearchRequest<T extends object> extends ILookupSearchRequest {
    additionalParameters: IAdditionalParameters<T>
}

export interface IBusinessPartnerReadOnly2EntityService<T extends object> {
    updateReadOnly?: (entity: T, readOnlyField: keyof T, value: number | undefined, editField: keyof T) => void;
    cellChange?: (entity: T, field: keyof T) => void;
}

export interface IBusinessPartner2ValidationService<T extends object> {
    validatePaymentTermFk?: (entity: T, field: keyof T) => Promise<void>;
}

export interface IBusinessPartner2ValidatorOptions<T extends object> {
    businessPartnerField?: keyof T;
    customerField?: keyof T;
    supplierField?: keyof T;
    subsidiaryField?: keyof T;
    contactField?: keyof T;
    paymentTermFiField?: keyof T;
    paymentTermPaField?: keyof T;
    paymentMethodField?: keyof T;
    vatGroupField?: keyof T;
    businessPostingGroupField?: keyof T;
    bankField?: keyof T;
    originVatGroupField?: keyof T;
    bankTypeField?: keyof T;
    needLoadDefaultSupplier?: boolean;
    needLoadDefaultCustomer?: boolean;
    subsidiaryFromBpDialog?: boolean;
    customerSearchRequest?: ILookupSearchRequest | null;
    dataService?: IEntityRuntimeDataRegistry<T> & IBusinessPartnerReadOnly2EntityService<T>;
    validationService?: BaseValidationService<T> & IBusinessPartner2ValidationService<T> | null;
}

export interface IBusinessPartnerValidatorService<T extends object> {
    businessPartnerValidator: (context: IBusinessPartner2ValidationContext<T>) => Promise<ValidationResult>;
    subsidiaryValidator: (entity: T, value: number) => Promise<ValidationResult>;
    supplierValidator: (entity: T, value: number, dontSetPaymentTerm?: boolean) => Promise<ValidationResult>;

    resetArgumentsToValidate: (options: IBusinessPartner2ValidatorOptions<T>) => void;
    GetDefaultSupplier: (entity: T, value: number) => Promise<void>;
    resetRelatedFieldsBySupplier: (entity: T, supplierFk: number, dontSetPaymentTerm?: boolean) => Promise<void>;
    loadDefaultCustomer: (entity: T, businessPartnerFk: number, subsidiaryFk: number) => Promise<void>;
    setDefaultContactByBranch: (entity: T, businessPartnerFk: number, branchFk: number) => Promise<void>;
}

export interface IBusinessPartner2ValidationContext<T extends object> {
    entity: T;
    value: number | undefined;
    needAttach?: boolean | undefined;
    notNeedLoadDefaultSubsidiary?: boolean | undefined;
    pointedSupplierFk?: number | undefined;
    pointedSubsidiaryFk?: number | undefined;
}


export const BUSINESS_PARTNER_VALIDATOR_OPTIONS = new InjectionToken<IBusinessPartner2ValidatorOptions<object>>('businessPartner2ValidatorOptions');