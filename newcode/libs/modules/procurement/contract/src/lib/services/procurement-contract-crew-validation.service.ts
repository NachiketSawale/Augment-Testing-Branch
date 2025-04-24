/*
 * Copyright(c) RIB Software GmbH
 */

import {
	IEntityRuntimeDataRegistry,
	IValidationFunctions, ValidationInfo, ValidationResult,
} from '@libs/platform/data-access';
import { ProcurementBaseValidationService } from '@libs/procurement/shared';
import { IConCrewEntity } from '../model/entities/con-crew-entity.interface';
import { ProcurementContractCrewDataService } from './procurement-contract-crew-data.service';
import { isNil } from 'lodash';


/**
 * Procurement contract crew validation service
 */
export abstract class ProcurementContractCrewValidationService extends ProcurementBaseValidationService<IConCrewEntity> {

	/**
	 *
	 * @param dataService
	 */
	protected constructor(protected dataService: ProcurementContractCrewDataService) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<IConCrewEntity> {
		return {
			DescriptionInfo: this.validateDescriptionInfo,
			Sorting: this.validateSorting,
			IsDefault: this.validateIsDefault
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IConCrewEntity> {
		return this.dataService;
	}

	protected validateDescriptionInfo(info: ValidationInfo<IConCrewEntity>) {
		if (isNil(info.value)) {
			return new ValidationResult('cloud.common.emptyOrNullValueErrorMessage');
		}
		return new ValidationResult();
	}

	protected validateSorting(info: ValidationInfo<IConCrewEntity>) {
		return this.validateIsMandatory(info);
	}

	protected validateIsDefault(info: ValidationInfo<IConCrewEntity>) {
		const itemList = this.dataService.getList();
		if (info.value) {
			itemList.forEach(e => {
				e.IsDefault = false;
			});
			info.entity.IsDefault = true;
		}
		return new ValidationResult();
	}
}