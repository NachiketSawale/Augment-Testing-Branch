/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo,
    ValidationResult
} from '@libs/platform/data-access';
import {BasicsSharedClerkRoleLookupService, BasicsSharedDataValidationService} from '@libs/basics/shared';
import {BasicsProcurementStructureClerkDataService} from './basics-procurement-structure-clerk-data.service';
import { IPrcStructure2clerkEntity } from '../model/entities/prc-structure-2-clerk-entity.interface';


/**
 * procurement structure role validation service
 */

@Injectable({
    providedIn: 'root'
})
export class BasicsProcurementStructureClerkValidationService extends BaseValidationService<IPrcStructure2clerkEntity> {
    private dataService = inject(BasicsProcurementStructureClerkDataService);
    private validationUtils = inject(BasicsSharedDataValidationService);
    private basicsSharedClerkRoleLookupService = inject(BasicsSharedClerkRoleLookupService);

    protected generateValidationFunctions(): IValidationFunctions<IPrcStructure2clerkEntity> {
        return {
            validateCompanyFk: this.validateCompanyFk,
            validateClerkRoleFk: this.validateClerkRoleFk,
            validateClerkFk: this.validateClerkFk
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcStructure2clerkEntity> {
        return this.dataService;
    }

    protected validateCompanyFk(info: ValidationInfo<IPrcStructure2clerkEntity>): ValidationResult {
        return this.validationUtils.isGroupUnique(info, this.dataService.getList(), {
            CompanyFk: <number>info.value,
            ClerkRoleFk: info.entity.ClerkRoleFk,
            ClerkFk: info.entity.ClerkFk,
        }, {
            key: 'basics.procurementstructure.threeFiledUniqueValueErrorMessage',
            params: {field1: 'company', field2: 'role', field3: 'clerk'}
        });
    }

    protected validateClerkFk(info: ValidationInfo<IPrcStructure2clerkEntity>): ValidationResult {
        return this.validationUtils.isGroupUnique(info, this.dataService.getList(), {
            CompanyFk: info.entity.CompanyFk,
            ClerkRoleFk: info.entity.ClerkRoleFk,
            ClerkFk: <number>info.value,
        }, {
            key: 'cloud.common.threeFiledUniqueValueErrorMessage',
            params: {field1: 'company', field2: 'role', field3: 'clerk'}
        });
    }

    /**
     * validate clerk role
     * @param info
     * @protected
     */
    protected validateClerkRoleFk(info: ValidationInfo<IPrcStructure2clerkEntity>): ValidationResult {
        const value = <number>info.value;
        if (value) {
            //todo angular.js here have problem too,need recheck this logic
            /*
            this.basicsSharedClerkRoleLookupService.getItemByKey({
               id: value
           }).subscribe(role=>{
                  if(role.Isunique){
					this.validationUtils.isUnique(this.dataService, info, this.dataService.getList(), false);
                  }
            });
             */
        }
        return this.validationUtils.isMandatory(info);
    }
}
