
/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo
} from '@libs/platform/data-access';
import { BasicsMaterialPriceVersionToStockListDataService } from './basics-material-price-version-to-stock-list-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IStock2matPriceverEntity } from '../model/entities/stock-2-mat-pricever-entity.interface';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * Material Price Version To Stock List validation service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsMaterialPriceVersionToStockListValidationService extends BaseValidationService<IStock2matPriceverEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(BasicsMaterialPriceVersionToStockListDataService);
	private translationService: PlatformTranslateService = inject(PlatformTranslateService);

	protected generateValidationFunctions(): IValidationFunctions<IStock2matPriceverEntity> {
		return {
			MdcMatPriceverFk: this.validateMdcMatPriceverFk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IStock2matPriceverEntity> {
		return this.dataService;
	}

	protected validateMdcMatPriceverFk(info: ValidationInfo<IStock2matPriceverEntity>) {
		if (info.value === 0) {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.emptyOrNullValueErrorMessage',
				params: { fieldName: this.translationService.instant('basics.material.priceList.materialPriceVersion').text },
			});
		}
		return this.validationUtils.isUniqueAndMandatory(info, this.dataService.getList(), 'basics.material.priceList.materialPriceVersion');
	}
}