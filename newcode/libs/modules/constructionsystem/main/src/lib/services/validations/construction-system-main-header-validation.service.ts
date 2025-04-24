/*
 * Copyright(c) RIB Software GmbH
 */

import { Inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ICosHeaderEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMainHeaderListDataService } from '../construction-system-main-header-list-data.service';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainHeaderValidationService extends BaseValidationService<ICosHeaderEntity> {
	private readonly dataService = Inject(ConstructionSystemMainHeaderListDataService);

	protected generateValidationFunctions(): IValidationFunctions<ICosHeaderEntity> {
		return {
			IsChecked: this.validateIsChecked,
		};
	}

	protected validateIsChecked(info: ValidationInfo<ICosHeaderEntity>): ValidationResult {
		const value = (info.value as boolean) ?? false;
		this.dataService.isCheckedValueChange(info.entity, value);
		// setTimeout(function () { todo
		//     basicsCommonHeaderColumnCheckboxControllerService.checkHeaderCheckBox($scope.gridId, [checkField], checkBoxOptions);
		// });
		return new ValidationResult();
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosHeaderEntity> {
		return this.dataService;
	}
}
