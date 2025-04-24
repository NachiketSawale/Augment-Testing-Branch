import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSite2ExternalEntity } from '../../model/basics-site2-external-entity.class';
import { inject, Injectable } from '@angular/core';
import { BasicsSite2ExternalDataService } from '../basics-site2-external-data.service';
@Injectable({
	providedIn: 'root',
})

export class BasicsSiteExternalValidationservice extends BaseValidationService<BasicsSite2ExternalEntity> {
    private dataService = inject(BasicsSite2ExternalDataService);

    protected generateValidationFunctions(): IValidationFunctions<BasicsSite2ExternalEntity> {
        return {
            BasExternalsourceFk : this.validateBasExternalsourceFk,
            ExtCode: this.validateExtCode
        };
    }
    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<BasicsSite2ExternalEntity> {
        return this.dataService;
    }
    protected validateBasExternalsourceFk(info: ValidationInfo<BasicsSite2ExternalEntity>): ValidationResult {
        return this.validateIsMandatory(info);
    }
    protected validateExtCode(info: ValidationInfo<BasicsSite2ExternalEntity>): ValidationResult {
        return this.validateIsMandatory(info);
    }

}