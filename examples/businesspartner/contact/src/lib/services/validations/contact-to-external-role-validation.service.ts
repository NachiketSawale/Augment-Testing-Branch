import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import {MODULE_INFO_BUSINESSPARTNER} from '@libs/businesspartner/common';
import {inject} from '@angular/core';
import {ContactToExternalRoleDataService} from '../contact-to-external-role-data.service';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import {PlatformTranslateService, Translatable} from '@libs/platform/common';
import { IContact2ExtRoleEntity } from '@libs/businesspartner/interfaces';

export class Contact2ExternalRoleValidationService extends BaseValidationService<IContact2ExtRoleEntity> {
	private dataService = inject(ContactToExternalRoleDataService);
	private validationService: BasicsSharedDataValidationService = inject(BasicsSharedDataValidationService);
	private translationService: PlatformTranslateService = inject(PlatformTranslateService);

	protected override generateValidationFunctions(): IValidationFunctions<IContact2ExtRoleEntity> {
		return {
			ExternalRoleFk: this.validateExternalRoleFk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IContact2ExtRoleEntity> {
		return this.dataService;
	}

	protected validateExternalRoleFk(info: ValidationInfo<IContact2ExtRoleEntity>): ValidationResult {
		const list = this.dataService.getList();
		const tempInfo: ValidationInfo<IContact2ExtRoleEntity> = {
			entity: info.entity,
			value: !info.value ? undefined : info.value,
			field: info.field
		};

		const fieldName: Translatable = {
					text: this.translationService.instant(MODULE_INFO_BUSINESSPARTNER.businesspartnerContactModuleName + '.ExternalRoleFk').text,
				};
		return this.validationService.isUniqueAndMandatory(tempInfo, list, fieldName);
	}
}