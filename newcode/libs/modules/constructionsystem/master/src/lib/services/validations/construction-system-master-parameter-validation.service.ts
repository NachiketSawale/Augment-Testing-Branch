/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { ConstructionSystemMasterParameterDataService } from '../construction-system-master-parameter-data.service';
import { ConstructionSystemMasterParameterValueDataService } from '../construction-system-master-parameter-value-data.service';
import { ConstructionSystemMasterParameterTypeLookupService } from '../lookup/construction-system-master-parameter-type-lookup.service';
import { ConstructionSystemMasterParameterReadonlyProcessorService } from '../processors/construction-system-master-parameter-readonly-processor.service';
import { ParameterDataTypes, ICosParameterEntity, ICosParameterValueEntity } from '@libs/constructionsystem/shared';
import { ConstructionSystemMasterValidationHelperService } from '../construction-system-master-validation-helper.service';
import { CosDefaultType } from '@libs/constructionsystem/common';

/**
 * Construction system master parameter validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameterValidationService extends BaseValidationService<ICosParameterEntity> {
	private readonly translate = inject(PlatformTranslateService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly dataService = inject(ConstructionSystemMasterParameterDataService);
	private readonly paramValueDataService = inject(ConstructionSystemMasterParameterValueDataService);
	private readonly paramTypeLookupService = inject(ConstructionSystemMasterParameterTypeLookupService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly validationHelperService = inject(ConstructionSystemMasterValidationHelperService);
	private readonly readonlyProcessor = inject(ConstructionSystemMasterParameterReadonlyProcessorService);

	protected generateValidationFunctions(): IValidationFunctions<ICosParameterEntity> {
		return {
			CosDefaultTypeFk: this.validateCosDefaultTypeFk,
			CosParameterTypeFk: this.asyncValidateCosParameterTypeFk,
			IsLookup: this.validateIsLookup,
			DefaultValue: this.asyncValidateDefaultValue,
			VariableName: this.validateVariableName,
			QuantityQuery: this.validateQuantityQuery,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosParameterEntity> {
		return this.dataService;
	}

	// todo-allen: The validation function doesn't seem to be used.
	private validateProperty(info: ValidationInfo<ICosParameterEntity>) {
		return this.validationUtils.isUnique(this.dataService, info, this.dataService.getList());
	}

	private validateCosDefaultTypeFk(info: ValidationInfo<ICosParameterEntity>) {
		info.entity.CosDefaultTypeFk = info.value as number;
		if (!(info.value === CosDefaultType.PropertyOrQuantityQuery || info.value === CosDefaultType.QuantityQuery)) {
			if (info.entity.QuantityQueryInfo) {
				info.entity.QuantityQueryInfo.Description = '';
				if (info.entity.QuantityQueryInfo.DescriptionTr) {
					info.entity.TranslationTrToDelete = info.entity.QuantityQueryInfo.DescriptionTr;
					info.entity.QuantityQueryInfo.DescriptionModified = true;
					info.entity.QuantityQueryInfo.DescriptionTr = 0;
					info.entity.QuantityQueryInfo.Modified = true;
					info.entity.QuantityQueryInfo.Translated = '';
					info.entity.QuantityQueryTranslationList = [];
				}
			}
		}
		this.readonlyProcessor.process(info.entity);
		this.dataService.defaultTypeChanged.next(null);
		return this.validationUtils.createSuccessObject();
	}

	public async asyncValidateCosParameterTypeFk(info: ValidationInfo<ICosParameterEntity>) {
		const oldValue = info.entity.CosParameterTypeFk;
		info.entity.CosParameterTypeFk = info.value as number;
		const checkType = this.checkParameterType(info.value as number, oldValue);
		if (!info.entity.IsLookup) {
			await this.setDefaultValueByType(info.entity, checkType, info.value as number);
			return this.validationUtils.createSuccessObject();
		}

		const valuesData: ICosParameterValueEntity[] = this.paramValueDataService.getList();
		const values = $.extend(false, valuesData);
		const parameter = this.dataService.getSelectedEntity();

		if (valuesData !== null && (info.value === ParameterDataTypes.Boolean || info.value === ParameterDataTypes.Date || (info.value !== ParameterDataTypes.Text && oldValue === ParameterDataTypes.Date))) {
			const oldDesc = await firstValueFrom(this.paramTypeLookupService.getItemByKey({ id: oldValue }));
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
						info.entity.CosParameterTypeFk = oldValue;
						this.dataService.parameterValidateComplete.next(info.entity);
						info.entity.IsLookup = true;
						info.entity.CosParameterTypeFk = info.value as number;
					}
					this.dataService.parameterValidateComplete.next(info.entity);
				} else {
					await this.dataService.select(parameter);
					this.dataService.deleteValuesComplete.next({ entity: info.entity, values: values });
				}

				// dataService.gridRefresh(); todo-allen: gridRefresh implementation not present
				return this.validationUtils.createSuccessObject();
			} else {
				info.entity.CosParameterTypeFk = oldValue;
				// dataService.gridRefresh(); todo-allen: gridRefresh implementation not present
				return this.validationUtils.createSuccessObject();
			}
		} else {
			if (valuesData !== null) {
				this.dataService.parameterValueValidateComplete.next({ checkType: checkType, value: <number>info.value });
			}
			// dataService.gridRefresh(); todo-allen: gridRefresh implementation not present
			this.readonlyProcessor.process(info.entity);
			this.dataService.parameterValidateComplete.next(info.entity);
			return this.validationUtils.createSuccessObject();
		}
	}

	private checkParameterType(typeId: number, oldValue: number) {
		const allowedTypes = [ParameterDataTypes.Integer, ParameterDataTypes.Decimal1, ParameterDataTypes.Decimal2, ParameterDataTypes.Decimal3, ParameterDataTypes.Decimal4, ParameterDataTypes.Decimal5, ParameterDataTypes.Decimal6];
		return oldValue > typeId && allowedTypes.includes(typeId);
	}

	private async setDefaultValueByType(entity: ICosParameterEntity, checkType: boolean, value: number) {
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
		this.dataService.parameterValidateComplete.next(entity);
		// dataService.gridRefresh(); todo-allen: gridRefresh implementation not present
	}

	private validateIsLookup(info: ValidationInfo<ICosParameterEntity>) {
		info.entity.DefaultValue = null;
		setTimeout(() => {
			// make sure the islookup property get the right value
			this.dataService.parameterValidateComplete.next(null);
		});
		return this.validationUtils.createSuccessObject();
	}

	private async asyncValidateDefaultValue(info: ValidationInfo<ICosParameterEntity>) {
		info.entity.DefaultValue = info.value as string | number | boolean | Date | null;
		// dataService.gridRefresh(); todo-allen: gridRefresh implementation not present
		return this.validationUtils.createSuccessObject();
	}

	public validateVariableName(info: ValidationInfo<ICosParameterEntity>) {
		return this.validationHelperService.validateVariableName(this.dataService, info, this.dataService.getList());
	}

	private validateQuantityQuery() {
		return this.validationUtils.createSuccessObject();
	}
}
