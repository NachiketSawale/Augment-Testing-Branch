import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { GeneralsDataService } from '../generals-data.service';
import { BasicsSharedDataValidationService, BasicsSharedGeneralTypeLookupService } from '@libs/basics/shared';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { BusinesspartnerMainHeaderDataService } from '../businesspartner-data.service';
import { get, isUndefined, isObject, isNull } from 'lodash';
import { firstValueFrom } from 'rxjs';
import { IGeneralsEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
export class GeneralsValidationService extends BaseValidationService<IGeneralsEntity>{
	private generalsDataService = inject(GeneralsDataService);
	private basicsValidation = inject(BasicsSharedDataValidationService);
	private translate = inject(PlatformTranslateService);
	private readonly bpMainHeaderDataService = inject(BusinesspartnerMainHeaderDataService);
	private readonly httpService = inject(PlatformHttpService);
	private readonly generalsTypeService = inject(BasicsSharedGeneralTypeLookupService);
	protected generateValidationFunctions(): IValidationFunctions<IGeneralsEntity> {
		return {
			PrcGeneralstypeFk: this.validatePrcGeneralstypeFk,
			ControllingUnitFk: this.validateControllingUnitFk,
			ValidateEntity: this.validateEntity
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IGeneralsEntity> {
		return this.generalsDataService;
	}

	protected async validatePrcGeneralstypeFk(info: ValidationInfo<IGeneralsEntity>): Promise<ValidationResult> {
		const isValid = this.basicsValidation.isUnique(this.getEntityRuntimeData(), info, this.generalsDataService.getList());
		if (isValid.valid) {
			const headerItem = this.bpMainHeaderDataService.getSelectedEntity();
			const generalType = await firstValueFrom(this.generalsTypeService.getItemByKey({id: info.entity.PrcGeneralstypeFk}));
			if (isObject(generalType)) {
				info.entity.ValueType = generalType.IsPercent ? 1 : 0;
				if (generalType.IsCost) {
					info.entity.IsCost = true;
					info.entity.ControllingUnitFk = get(headerItem, 'ControllingUnitFk') as unknown as number;
					info.entity.TaxCodeFk = headerItem?.TaxNo as number | null | undefined;
				} else {
					info.entity.ControllingUnitFk = null;
					info.entity.TaxCodeFk = null;
					info.entity.IsCost = false;
				}
			}
			info.entity.PrcGeneralstypeFk = info.value?.valueOf() as number;
			//todo this.generalsDataService.fireItemModified(info.entity);
		}
		return isValid;
	}

	protected async validateControllingUnitFk(info: ValidationInfo<IGeneralsEntity>): Promise<ValidationResult> {
		const result = this.basicsValidation.createSuccessObject();
		if (isNull(info.value) || isUndefined(info.value)) {
			return result;
		} else {
			const projectFk = get(info.entity, 'ProjectFk') as unknown as number || -1;
			const resp = await this.httpService.get<boolean>('controlling/structure/validationControllingUnit?ControllingUnitFk=' + (info.value.valueOf() as number) + '&ProjectFk=' + projectFk);
			if (resp) {
				result.valid = false;
				result.apply = true;
				result.error = this.translate.instant('basics.common.error.controllingUnitError').text;
				return result;
			}
		}
		return result;
	}

	protected async validateEntity(info: ValidationInfo<IGeneralsEntity>): Promise<ValidationResult> {
		return await this.validatePrcGeneralstypeFk(info);
	}

}