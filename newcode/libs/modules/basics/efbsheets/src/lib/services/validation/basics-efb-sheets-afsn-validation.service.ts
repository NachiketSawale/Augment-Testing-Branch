/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
    BaseValidationService,
    IValidationFunctions,
    ValidationInfo,
    ValidationResult
} from '@libs/platform/data-access';
import { firstValueFrom } from 'rxjs';
import { BasicsEfbSheetsAdditionalCostLookupService } from '../../basics-efbsheets-lookup/basics-efb-sheets-additional-cost-lookup-data.service';
import { IEstCrewMixAfsnEntity } from '@libs/basics/interfaces';

@Injectable({
    providedIn: 'root'
})

/**
 * BasicsEfbsheetsAfsnValidationService provides validation methods for Efbsheets Afsn
 */
export abstract class BasicsEfbsheetsAfsnValidationService extends BaseValidationService<IEstCrewMixAfsnEntity> {

    private basicsEfbSheetsAdditionalCostLookupDataService = inject(BasicsEfbSheetsAdditionalCostLookupService);

    /**
     * Generates the validation functions for Efbsheets Afsn
     * @returns An object containing the validation functions.
     */
    protected generateValidationFunctions(): IValidationFunctions<IEstCrewMixAfsnEntity> {
        return {
            validateMdcWageGroupFk: this.validateMdcWageGroupFk,
        };
    }

    /**
     * Validates if the code is unique and mandatory.
     * @param info Validation information for the Efbsheets Afsn Entity.
     * @returns ValidationResult indicating the validation result.
     */
    protected async validateMdcWageGroupFk(info: ValidationInfo<IEstCrewMixAfsnEntity>): Promise<ValidationResult> {
        if (info.value) {
            try {
                const response = await firstValueFrom(this.basicsEfbSheetsAdditionalCostLookupDataService.getList());
    
                const customizeMarkupRate = response.find(item => item.Id === info.value);
    
                if (customizeMarkupRate) {
                    info.entity.MarkupRate = customizeMarkupRate.MarkupRate;
                }
            } catch (error) {
                console.error('Error during validation:', error);
            }
        }
		return new ValidationResult();
    }

}