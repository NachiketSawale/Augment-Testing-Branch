/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult, } from '@libs/platform/data-access';
import { inject } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IBasicsScopeDataService, IMaterialScopeEntity, IBasicsScopeValidationService } from '@libs/basics/interfaces';
import { BusinessPartnerLogicalValidatorFactoryService } from '@libs/businesspartner/shared';

export class BasicsScopeValidationService<T extends IMaterialScopeEntity> extends BaseValidationService<T> implements IBasicsScopeValidationService<T> {
    private readonly validationUtils = inject(BasicsSharedDataValidationService);
    private readonly businessPartnerLogicalValidatorFactoryService = inject(BusinessPartnerLogicalValidatorFactoryService);
    private readonly bpValidator = this.businessPartnerLogicalValidatorFactoryService.create({
        dataService: this.dataService
    });
    private readonly bpProdValidator = this.businessPartnerLogicalValidatorFactoryService.create({
        dataService: this.dataService,
        businessPartnerField: 'BusinessPartnerProdFk',
        subsidiaryField: 'SubsidiaryProdFk',
        supplierField: 'SupplierProdFk'
    });

    public constructor(private readonly dataService: IBasicsScopeDataService<T>) {
        super();
    }

    public generateValidationFunctions(): IValidationFunctions<T> {
        return {
            BusinessPartnerFk: this.validateBusinessPartnerFk,
            SupplierFk: this.validateSupplierFk,
            SubsidiaryFk: this.validateSubsidiaryFk,
            BusinessPartnerProdFk: this.validateBusinessPartnerProdFk,
            SupplierProdFk: this.validateSupplierProdFk,
            SubsidiaryProdFk: this.validateSubsidiaryProdFk,
            IsSelected: this.validateIsSelected.bind(this),
        };
    }

    public getEntityRuntimeData(): IEntityRuntimeDataRegistry<T> {
        return this.dataService;
    }

    protected validateIsSelected(info: ValidationInfo<T>): ValidationResult {

        if (info.value) {
            //Set other scope which is selected = true to false. To make sure only one scope is selected
            this.dataService.getList().filter(e => e.IsSelected && e.Id !== info.entity.Id).forEach(e => e.IsSelected = false);
        }

        return this.validationUtils.createSuccessObject();
    }

    protected validateBusinessPartnerFk = async (info: ValidationInfo<T>) => this.bpValidator.businessPartnerValidator({entity: info.entity, value: info.value as number});
    protected validateSubsidiaryFk = async (info: ValidationInfo<T>) => this.bpValidator.subsidiaryValidator(info.entity, info.value as number);
    protected validateSupplierFk = async (info: ValidationInfo<T>) => this.bpValidator.supplierValidator(info.entity, info.value as number);
    protected validateBusinessPartnerProdFk = async (info: ValidationInfo<T>) => this.bpProdValidator.businessPartnerValidator({entity: info.entity, value: info.value as number});
    protected validateSubsidiaryProdFk = async (info: ValidationInfo<T>) => this.bpProdValidator.subsidiaryValidator(info.entity, info.value as number);
    protected validateSupplierProdFk = async (info: ValidationInfo<T>) => this.bpProdValidator.supplierValidator(info.entity, info.value as number);
}