/*
 * Copyright(c) RIB Software GmbH
 */
import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo,
    ValidationResult
} from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedClerkDataService } from './basics-shared-clerk-data.service';
import { BasicsSharedDataValidationService } from '../../services/basics-shared-data-validation.service';
import { IBasicsClerkEntity } from '../model/basics-clerk-entity.interface';

@Injectable({
    providedIn: 'root'
})
export class BasicsSharedClerkValidationService extends BaseValidationService<IBasicsClerkEntity>{
    private dataService = inject(BasicsSharedClerkDataService);
    private validationService = inject(BasicsSharedDataValidationService);
    protected validateClerkRoleFk(info: ValidationInfo<IBasicsClerkEntity>): ValidationResult {
        return this.validationService.isUnique(this.dataService, info, this.dataService.getList());
    }

    protected validateClerkFk(info: ValidationInfo<IBasicsClerkEntity>): ValidationResult {
        const validateResult: ValidationResult = { apply: true, valid: true };
        if (info.entity.ClerkFk === 0 || info.entity.ClerkFk === null) {
           return this.validationService.isMandatory(info);
        }
        return  validateResult;
    }
    // to-do validateValidFrom & validateValidTo

    protected generateValidationFunctions(): IValidationFunctions<IBasicsClerkEntity> {
        return {
            ClerkRoleFk:this.validateClerkRoleFk,
            ClerkFk:this.validateClerkFk
        };
    }
    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBasicsClerkEntity> {
        return this.dataService;
    }
}