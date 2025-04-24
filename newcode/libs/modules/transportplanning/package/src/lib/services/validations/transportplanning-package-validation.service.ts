import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ITransportPackageEntity } from '../../model/models';
import { inject, Injectable } from '@angular/core';
import { TransportplanningPackageDataService } from '../transportplanning-package-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';

@Injectable({
    providedIn: 'root',
})
export class TransportPlanningPackageValidationService extends BaseValidationService<ITransportPackageEntity> {
    private dataService = inject(TransportplanningPackageDataService);
    private validateUtils = inject(BasicsSharedDataValidationService);

    protected generateValidationFunctions(): IValidationFunctions<ITransportPackageEntity> {
        return {
            Code: this.validateCode,
            Quantity: this.validateQuantity,
        };
    }

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ITransportPackageEntity> {
        return this.dataService;
    }

    protected validateCode(info: ValidationInfo<ITransportPackageEntity>): ValidationResult {
        return this.validateUtils.isMandatory(info);
    }

    protected validateQuantity(info: ValidationInfo<ITransportPackageEntity>): ValidationResult {
        const value = info.value as number;
        if (value === null || value === undefined) {
            return this.validateUtils.isMandatory(info);
        } else {
            const remainQty = 999999;
            if (value <= 0 || value > remainQty) {
                return this.validateUtils.createErrorObject({
                    key: 'transportplanning.package.errors.errorQtyInput',
                    params: {},
                });
            }
        }
        // Return success if the value is valid
        return this.validateUtils.createSuccessObject();
    }
}
