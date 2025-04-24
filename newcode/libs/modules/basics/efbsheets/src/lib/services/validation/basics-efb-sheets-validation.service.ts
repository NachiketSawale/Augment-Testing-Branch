/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {
    BaseValidationService,
    IEntityRuntimeDataRegistry,
    IValidationFunctions,
    ValidationInfo,
} from '@libs/platform/data-access';
import {IBasicsEfbsheetsEntity} from '@libs/basics/interfaces';
import { BasicsEfbsheetsDataService } from '../basics-efbsheets-data.service';

@Injectable({
    providedIn: 'root'
})

/**
 * BasicsEfbsheetsValidationService provides validation methods for Efbsheets
 */
export abstract class BasicsEfbsheetsValidationService extends BaseValidationService<IBasicsEfbsheetsEntity> {
   
    private efbSheetDataService = inject(BasicsEfbsheetsDataService);
    
    /**
     * Generates the validation functions for Efbsheets
     * @returns An object containing the validation functions.
     */
    protected generateValidationFunctions(): IValidationFunctions<IBasicsEfbsheetsEntity> {
        return {
            Code: [this.validateIsMandatory,this.validateIsUnique],
        };
    }

    protected override getLoadedEntitiesForUniqueComparison = (info: ValidationInfo<IBasicsEfbsheetsEntity>): IBasicsEfbsheetsEntity[] => {
        const itemList = this.efbSheetDataService.getList();
		const res = itemList.filter(item => {
			return (item as never)[info.field] === info.value && item.Id !== info.entity.Id;
		});

		return res;
	};

    protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBasicsEfbsheetsEntity> {
		return this.efbSheetDataService;
	}
}