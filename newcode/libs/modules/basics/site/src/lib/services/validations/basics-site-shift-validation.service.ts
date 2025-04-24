import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSite2TksShiftEntity } from '../../model/basics-site2-tks-shift-entity.class';
import { inject, Injectable } from '@angular/core';
import { BasicsSite2TksShiftDataService } from '../basics-site2-tks-shift-data.service';
@Injectable({
    providedIn: 'root',
})

export class BasicsSiteShiftValidationService extends BaseValidationService<BasicsSite2TksShiftEntity> {
    private dataService = inject(BasicsSite2TksShiftDataService);


    protected generateValidationFunctions(): IValidationFunctions<BasicsSite2TksShiftEntity> {
        return {
            TksShiftFk: this.validatetksShift
        };
    }
    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<BasicsSite2TksShiftEntity> {
        return this.dataService;
    }

    protected validatetksShift(info: ValidationInfo<BasicsSite2TksShiftEntity>): ValidationResult {
        return this.validateIsMandatory(info);
	}

}