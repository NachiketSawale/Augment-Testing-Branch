import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import {MODULE_INFO_BUSINESSPARTNER} from '@libs/businesspartner/common';
import {inject} from '@angular/core';
import {ContactToExternalDataService} from '../contact-to-external-data.service';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import {PlatformTranslateService, Translatable} from '@libs/platform/common';
import { IContact2ExternalEntity } from '@libs/businesspartner/interfaces';

export class Contact2ExternalValidationService extends BaseValidationService<IContact2ExternalEntity> {
	private dataService = inject(ContactToExternalDataService);
	private validationService: BasicsSharedDataValidationService = inject(BasicsSharedDataValidationService);
	private translationService: PlatformTranslateService = inject(PlatformTranslateService);

	protected override generateValidationFunctions(): IValidationFunctions<IContact2ExternalEntity> {
		return {
			ExternalSourceFk: this.validateExternalSourceFk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IContact2ExternalEntity> {
		return this.dataService;
	}

	protected validateExternalSourceFk(info: ValidationInfo<IContact2ExternalEntity>): ValidationResult {

		const tempInfo: ValidationInfo<IContact2ExternalEntity> = {
			entity: info.entity,
			value: !info.value ? undefined : info.value,
			field: info.field
		};
		const fieldName: Translatable = {
			text: this.translationService.instant(MODULE_INFO_BUSINESSPARTNER.businesspartnerContactModuleName + '.externalSourceFk').text,
		};
		return this.validationService.isMandatory(tempInfo,fieldName);
	}
}