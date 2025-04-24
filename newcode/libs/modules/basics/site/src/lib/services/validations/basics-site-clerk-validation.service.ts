import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicSite2ClerkEntity } from '../../model/basic-site2-clerk-entity.class';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicSite2ClerkDataService } from '../basic-site2-clerk-data.service';

@Injectable({
	providedIn: 'root',
})

export class BasicsSiteClerkValidationService extends BaseValidationService<BasicSite2ClerkEntity> {
    private dataService = inject(BasicSite2ClerkDataService);
    private validationService = inject(BasicsSharedDataValidationService);
    
    protected generateValidationFunctions(): IValidationFunctions<BasicSite2ClerkEntity> {
        return {
            ClerkRoleFk:this.validateClerkRoleFk,
            ClerkFk:this.validateClerkFk,
            //ValidTo: this.validateValidTo,
            //ValidFrom: this.validateValidFrom
        };
    }
    protected validateClerkFk(info: ValidationInfo<BasicSite2ClerkEntity>): ValidationResult {
        const validateResult: ValidationResult = { apply: true, valid: true };
        if (info.entity.ClerkFk === 0 || info.entity.ClerkFk === null) {
           return this.validationService.isMandatory(info);
        }
        return  validateResult;
    }

    protected validateClerkRoleFk(info: ValidationInfo<BasicSite2ClerkEntity>): ValidationResult {
        this.validateIsMandatory(info);
        return this.validationService.isUnique(this.dataService, info, this.dataService.getList());
    }
    
    // private validateValidFrom(info: ValidationInfo<BasicSite2ClerkEntity>): ValidationResult {
    //     return this.validationService.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, (info.entity.ValidTo) ? info.entity.ValidTo.toString() : '', 'ValidTo');
	// }

	// private validateValidTo(info: ValidationInfo<BasicSite2ClerkEntity>): ValidationResult {
    //     return this.validationService.validatePeriod(this.getEntityRuntimeData(), info, (info.entity.ValidFrom) ? info.entity.ValidFrom.toString() : '', <string>info.value, 'ValidFrom');
	// }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<BasicSite2ClerkEntity> {
       return this.dataService;
    }

}