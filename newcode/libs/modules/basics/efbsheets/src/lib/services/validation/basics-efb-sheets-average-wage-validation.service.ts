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
import { BasicsEfbsheetsAverageWageDataService } from '../basics-efbsheets-average-wage-data.service';
import { BasicsEfbSheetsWageGroupLookupService } from '../../basics-efbsheets-lookup/basics-efb-sheets-wage-group-lookup.service';
import { firstValueFrom } from 'rxjs';
import { IBasicsEfbsheetsAverageWageEntity } from '@libs/basics/interfaces';

@Injectable({
    providedIn: 'root'
})

/**
 * BasicsEfbsheetsAverageWageValidationService provides validation methods for Efbsheets Average Wage
 */
export abstract class BasicsEfbsheetsAverageWageValidationService extends BaseValidationService<IBasicsEfbsheetsAverageWageEntity> {
    protected dataService = inject(BasicsEfbsheetsAverageWageDataService);
    private basicsEfbSheetsWageGroupLookupService = inject(BasicsEfbSheetsWageGroupLookupService);

    /**
     * Generates the validation functions for Efbsheets Average Wage
     * @returns An object containing the validation functions.
     */
    protected generateValidationFunctions(): IValidationFunctions<IBasicsEfbsheetsAverageWageEntity> {
        return {
            validateMdcWageGroupFk: this.validateMdcWageGroupFk,
        };
    }

    /**
     * Validates if the code is unique and mandatory.
     * @param info Validation information for the Efbsheets Average Wage Entity.
     * @returns ValidationResult indicating the validation result.
     */
    protected async validateMdcWageGroupFk(info: ValidationInfo<IBasicsEfbsheetsAverageWageEntity>): Promise<ValidationResult> {
        if (info.value) {
            try {
                const response = await firstValueFrom(this.basicsEfbSheetsWageGroupLookupService.getList());
    
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