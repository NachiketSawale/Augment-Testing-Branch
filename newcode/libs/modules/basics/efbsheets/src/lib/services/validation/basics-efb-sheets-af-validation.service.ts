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
import { BasicsEfbsheetsCrewMixAfDataService } from '../basics-efbsheets-crew-mix-af-data.service';
import { BasicsEfbSheetsSurchargeLookupService } from '../../basics-efbsheets-lookup/basics-efb-sheets-surcharge-lookup-data.service';
import { IEstCrewMixAfEntity } from '@libs/basics/interfaces';

@Injectable({
    providedIn: 'root'
})

/**
 * BasicsEfbsheetsAfValidationService provides validation methods for Efbsheets Af
 */
export abstract class BasicsEfbsheetsAfValidationService extends BaseValidationService<IEstCrewMixAfEntity> {
    protected dataService = inject(BasicsEfbsheetsCrewMixAfDataService);

    private basicsEfbSheetsSurchargeLookupDataService = inject(BasicsEfbSheetsSurchargeLookupService);

    /**
     * Generates the validation functions for Efbsheets Af
     * @returns An object containing the validation functions.
     */
    protected generateValidationFunctions(): IValidationFunctions<IEstCrewMixAfEntity> {
        return {
            validateMdcWageGroupFk: this.validateMdcWageGroupFk,
        };
    }

    /**
     * Validates if the code is unique and mandatory.
     * @param info Validation information for the Efbsheets Af Entity.
     * @returns ValidationResult indicating the validation result.
     */
    protected async validateMdcWageGroupFk(info: ValidationInfo<IEstCrewMixAfEntity>): Promise<ValidationResult> {
        if (info.value) {
            try {
                const response = await firstValueFrom(this.basicsEfbSheetsSurchargeLookupDataService.getList());
    
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