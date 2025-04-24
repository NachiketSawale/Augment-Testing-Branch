/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ICosWicEntity } from '../../model/entities/cos-wic-entity.interface';
import { ConstructionSystemMasterWicDataService } from '../construction-system-master-wic-data.service';

/**
 * Cos Wic validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterWicValidationService extends BaseValidationService<ICosWicEntity> {
	private readonly dataService = inject(ConstructionSystemMasterWicDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<ICosWicEntity> {
		return {
			Code: this.validateCode,
			BoqItemFk: this.validateBoqItemFk,
			BoqWicCatBoqFk: this.validateBoqWicCatBoqFk,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosWicEntity> {
		return this.dataService;
	}

	public validateCode(info: ValidationInfo<ICosWicEntity>) {
		const result = this.validationUtils.isUniqueAndMandatory(info, this.dataService.getList(), 'cloud.common.entityCode');
		if(!result.valid) {
			return result;
		}
		return this.validationUtils.createSuccessObject();
	}

	public validateBoqItemFk(info: ValidationInfo<ICosWicEntity>) {
		this.validationUtils.isMandatory(info);
		// todo: GET boq wiccat by boqItem.BoqHeaderFk
		// const selectedBoqItem = basicsLookupdataLookupDescriptorService.getLookupItem('BoqItemFk', value);
		// this.dataService.getBoqWicCatBoqFk(selectedBoqItem);
		this.validateBoqWicCatBoqFk(info);
		return this.validationUtils.createSuccessObject();
	}

	public validateBoqWicCatBoqFk(info: ValidationInfo<ICosWicEntity>) {
		this.validationUtils.isMandatory(info);
		return this.validationUtils.createSuccessObject();
	}
}
