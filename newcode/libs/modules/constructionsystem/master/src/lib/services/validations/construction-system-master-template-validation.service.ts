import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { ConstructionSystemMasterTemplateDataService } from '../construction-system-master-template-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ICosTemplateEntity } from '@libs/constructionsystem/shared';
import { PlatformHttpService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterTemplateValidationService extends BaseValidationService<ICosTemplateEntity> {
	private readonly dataService = inject(ConstructionSystemMasterTemplateDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private http = inject(PlatformHttpService);

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosTemplateEntity> {
		return this.dataService;
	}

	protected generateValidationFunctions(): IValidationFunctions<ICosTemplateEntity> {
		return {
			DescriptionInfo: this.updateLookupValue,
			IsDefault: this.validateIsDefault,
			Sorting: this.updateLookupValue,
		};
	}

	private validateIsDefault(info: ValidationInfo<ICosTemplateEntity>): ValidationResult {
		this.updateIsDefault(info);
		return this.validationUtils.createSuccessObject();
	}

	private updateLookupValue(info: ValidationInfo<ICosTemplateEntity>): ValidationResult {
		//todo basicsLookupdataLookupDescriptorService.updateData('CosTemplate', [entity]);
		return this.validationUtils.createSuccessObject();
	}

	private updateIsDefault(info: ValidationInfo<ICosTemplateEntity>) {
		const templates = this.dataService.getList();
		templates.forEach(t=>{
			if(t.Id === info.entity.Id) {
				if(!t.IsDefault) {
					t.IsDefault = true;
				}
			} else {
				t.IsDefault = false;
			}
		});
		this.dataService.entitiesUpdated(templates);
		// forEach(this.dataService.getList(), (item) => {
		// 	if (item !== info.entity && info.value && item.IsDefault) {
		// 		item.IsDefault = false;
		// 		//todo basicsLookupdataLookupDescriptorService.updateData('CosTemplate', [entity]);
		// 		this.dataService.entitiesUpdated([item]);
		// 	}
		// });
	}
}