/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { ConstructionSystemMasterParameterTypeLookupService } from '../lookup/construction-system-master-parameter-type-lookup.service';
import { ConstructionSystemMasterGlobalParameterDataService } from '../construction-system-master-global-parameter-data.service';
import { ConstructionSystemMasterGlobalParameterReadonlyProcessorService } from '../processors/construction-system-master-global-parameter-readonly-processor.service';
import { ConstructionSystemMasterGlobalParameterValueDataService } from '../construction-system-master-global-parameter-value-data.service';
import { ICosGlobalParamEntity, ICosGlobalParamValueEntity, ParameterDataTypes } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterValidationHelperService } from '../construction-system-master-validation-helper.service';

/**
 * Construction system master global parameter validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterGlobalParameterValidationService extends BaseValidationService<ICosGlobalParamEntity> {
	private readonly translate = inject(PlatformTranslateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly dataService = inject(ConstructionSystemMasterGlobalParameterDataService);
	private readonly globalParamValueDataService = inject(ConstructionSystemMasterGlobalParameterValueDataService);
	private readonly paramTypeLookupService = inject(ConstructionSystemMasterParameterTypeLookupService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly readonlyProcessor = inject(ConstructionSystemMasterGlobalParameterReadonlyProcessorService);
	private readonly validationHelperService = inject(ConstructionSystemMasterValidationHelperService);

	protected generateValidationFunctions(): IValidationFunctions<ICosGlobalParamEntity> {
		return {
			CosParameterTypeFk: this.asyncValidateCosParameterTypeFk,
			IsLookup: this.validateIsLookup,
			DefaultValue: this.asyncValidateDefaultValue,
			VariableName: this.validateVariableName,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosGlobalParamEntity> {
		return this.dataService;
	}

	public async asyncValidateCosParameterTypeFk(info: ValidationInfo<ICosGlobalParamEntity>) {
		const oldTypeFkValue = info.entity.CosParameterTypeFk;
		info.entity.CosParameterTypeFk = info.value as number;
		const checkType = this.checkParameterType(info.value as number, oldTypeFkValue);
		if (!info.entity.IsLookup) {
			await this.setDefaultValueByType(info.entity, checkType, info.value as number);
			return this.validationUtils.createSuccessObject();
		}

		const valuesData: ICosGlobalParamValueEntity[] = this.globalParamValueDataService.getList();
		const values = $.extend(false, valuesData);
		const parameter = this.dataService.getSelectedEntity();

		if (valuesData !== null && (info.value === ParameterDataTypes.Boolean || info.value === ParameterDataTypes.Date || (info.value !== ParameterDataTypes.Text && oldTypeFkValue === ParameterDataTypes.Date))) {
			const oldDesc = await firstValueFrom(this.paramTypeLookupService.getItemByKey({ id: oldTypeFkValue }));
			const currentDesc = await firstValueFrom(this.paramTypeLookupService.getItemByKey({ id: info.value as number }));
			const strContent = this.translate.instant('constructionsystem.master.validationTypeAndValueContent', { value0: oldDesc.Description, value1: currentDesc.Description }).text;
			const strTitle = this.translate.instant('constructionsystem.master.validationTypeAndValueTitle').text;

			const result = await this.messageBoxService.showYesNoDialog(strContent, strTitle);
			if (result?.closingButtonId === StandardDialogButtonId.Yes) {
				this.readonlyProcessor.process(info.entity);
				if (info.value === ParameterDataTypes.Boolean) {
					info.entity.DefaultValue = false;
					info.entity.IsLookup = false;
				} else {
					info.entity.DefaultValue = null;
				}

				if (info.entity.Id === this.dataService.getSelectedEntity()?.Id) {
					if (info.value !== ParameterDataTypes.Boolean) {
						info.entity.IsLookup = false;
						info.entity.CosParameterTypeFk = oldTypeFkValue;
						this.dataService.globalParameterValidateComplete.next(info.entity);
						info.entity.IsLookup = true;
						info.entity.CosParameterTypeFk = info.value as number;
					}
					this.dataService.globalParameterValidateComplete.next(info.entity);
				} else {
					await this.dataService.select(parameter);
					this.dataService.deleteValuesComplete.next({ entity: info.entity, values: values });
				}

				return this.validationUtils.createSuccessObject();
			} else {
				info.entity.CosParameterTypeFk = oldTypeFkValue;
				return this.validationUtils.createSuccessObject();
			}
		} else {
			if (valuesData !== null) {
				this.dataService.globalParameterValueValidateComplete.next({ checkType: checkType, value: <number>info.value });
			}
			this.readonlyProcessor.process(info.entity);
			this.dataService.globalParameterValidateComplete.next(info.entity);
			return this.validationUtils.createSuccessObject();
		}
	}

	private checkParameterType(typeId: number, oldValue: number) {
		return (
			oldValue > typeId &&
			(typeId === ParameterDataTypes.Integer ||
				typeId === ParameterDataTypes.Decimal1 ||
				typeId === ParameterDataTypes.Decimal2 ||
				typeId === ParameterDataTypes.Decimal3 ||
				typeId === ParameterDataTypes.Decimal4 ||
				typeId === ParameterDataTypes.Decimal5 ||
				typeId === ParameterDataTypes.Decimal6)
		);
	}

	private async setDefaultValueByType(entity: ICosGlobalParamEntity, checkType: boolean, value: number) {
		if (checkType) {
			if (entity.DefaultValue === undefined || isNaN(entity.DefaultValue as number) || entity.DefaultValue === '' || entity.DefaultValue === null) {
				entity.DefaultValue = 0;
			}
			let id: string | number = parseFloat(entity.DefaultValue.toString()).toFixed(value);
			id = isNaN(parseFloat(id)) ? 0 : parseFloat(id);
			entity.DefaultValue = id;
		} else if (value === ParameterDataTypes.Boolean) {
			entity.DefaultValue = false;
			entity.IsLookup = false;
		} else if (value === ParameterDataTypes.Date) {
			entity.DefaultValue = null;
		}

		this.readonlyProcessor.process(entity);
		this.dataService.globalParameterValidateComplete.next(entity);
	}

	private validateIsLookup(info: ValidationInfo<ICosGlobalParamEntity>) {
		info.entity.DefaultValue = null;
		setTimeout(() => {
			// make sure the islookup property get the right value
			this.dataService.globalParameterValidateComplete.next(null);
		});
		return this.validationUtils.createSuccessObject();
	}

	private async asyncValidateDefaultValue(info: ValidationInfo<ICosGlobalParamEntity>) {
		info.entity.DefaultValue = info.value as string | number | boolean | Date | null;
		return this.validationUtils.createSuccessObject();
	}

	public validateVariableName(info: ValidationInfo<ICosGlobalParamEntity>) {
		return this.validationHelperService.validateVariableName(this.dataService, info, this.dataService.getList());
	}
}
