/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { isEmpty, some } from 'lodash';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService, BasicsSharePrcConfigTotalKindsEnum as totalKinds } from '@libs/basics/shared';
import { BasicsProcurementConfigurationPrcTotalTypeDataService } from '../basics-procurement-configuration-prctotaltype-data.service';
import { IPrcTotalTypeEntity } from '../../model/entities/prc-total-type-entity.interface';

/**
 * The basic validation service for ProcurementConfiguration PrcTotalType
 */

@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementConfigurationPrcTotalTypeValidationService extends BaseValidationService<IPrcTotalTypeEntity> {
	private dataService = inject(BasicsProcurementConfigurationPrcTotalTypeDataService);
	private validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<IPrcTotalTypeEntity> {
		return {
			Formula: this.validateFormula,
			PrcTotalKindFk: this.validatePrcTotalKindFk,
			IsDefault: this.validateIsDefault,
			Code: this.validateCode,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcTotalTypeEntity> {
		return this.dataService;
	}

	private changeFormulaReadonly(info: ValidationInfo<IPrcTotalTypeEntity>, value: boolean): void {
		this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{ field: 'Formula', readOnly: value }]);
	}

	private changeSqlStatementReadonly(info: ValidationInfo<IPrcTotalTypeEntity>, value: boolean): void {
		this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{ field: 'SqlStatement', readOnly: value }]);
	}

	private changeIsEditableNetReadonly(info: ValidationInfo<IPrcTotalTypeEntity>, value: boolean): void {
		this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{ field: 'IsEditableNet', readOnly: value }]);
		if (value) {
			info.entity.IsEditableNet = !value;
		}
	}

	private changeIsEditableTaxReadonly(info: ValidationInfo<IPrcTotalTypeEntity>, value: boolean): void {
		this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{ field: 'IsEditableTax', readOnly: value }]);
		if (value) {
			info.entity.IsEditableTax = !value;
		}
	}

	private changeIsEditableGrossReadonly(info: ValidationInfo<IPrcTotalTypeEntity>, value: boolean): void {
		this.getEntityRuntimeData().setEntityReadOnlyFields(info.entity, [{ field: 'IsEditableGross', readOnly: value }]);
		if (value) {
			info.entity.IsEditableGross = !value;
		}
	}

	private changeIsEditableReadonly(info: ValidationInfo<IPrcTotalTypeEntity>, value: boolean): void {
		this.changeIsEditableNetReadonly(info, value);
		this.changeIsEditableTaxReadonly(info, value);
		this.changeIsEditableGrossReadonly(info, value);
	}

	private validateFormulaIsEmpty(value: string) {
		return isEmpty(value)
			? this.validationUtils.createErrorObject({
					key: 'basics.procurementconfiguration.nullFormularError',
					params: { object: 'formula' },
				})
			: this.validationUtils.createSuccessObject();
	}

	/**
	 * validate Formula
	 * @param info
	 * @protected
	 */
	protected validateFormula(info: ValidationInfo<IPrcTotalTypeEntity>): ValidationResult {
		return this.validateFormulaIsEmpty(<string>info.value);
	}

	protected validatePrcTotalKindFk(info: ValidationInfo<IPrcTotalTypeEntity>): ValidationResult {
		const id = info.entity.Id;
		let isEditableReadonly = true;
		const itemList = this.dataService.getList();

		switch (info.value) {
			case totalKinds.Formula:
				this.validateFormulaIsEmpty(<string>info.entity.Formula);
				this.changeFormulaReadonly(info, false);
				break;
			case totalKinds.CalculatedCost:
				info.entity.Formula = null;
				this.changeFormulaReadonly(info, true);
				break;
			default:
				info.entity.Formula = null;
				this.changeFormulaReadonly(info, true);
				isEditableReadonly = false;
		}

		this.changeIsEditableReadonly(info, isEditableReadonly);
		this.changeSqlStatementReadonly(info, info.value !== totalKinds.ConfigurableLine);
		if ([totalKinds.NetTotal, totalKinds.CostPlanningNet, totalKinds.BudgetNet].includes(<number>info.value)) {
			if (some(itemList, (item) => item.PrcTotalKindFk === info.value && item.Id !== id)) {
				return this.validationUtils.createErrorObject({
					key: 'cloud.common.uniqueValueErrorMessage',
					params: { object: 'Total Kind' },
				});
			}
		}
		return this.validationUtils.createSuccessObject();
	}

	protected validateIsDefault(info: ValidationInfo<IPrcTotalTypeEntity>): ValidationResult {
		return this.validationUtils.validateIsDefault(info, this.dataService);
	}

	protected validateCode(info: ValidationInfo<IPrcTotalTypeEntity>): ValidationResult {
		if (info.entity.PrcTotalKindFk === totalKinds.NetTotal && (info.value === '' || info.value === null) && info.entity.Code !== 'NET') {
			info.entity.Code = 'NET';
			//todo lcn: Use lookup cache to query
			// const totalTypeItem = dataService.getTotalKind(entity.PrcTotalKindFk);
			// if (totalTypeItem) {
			//     entity.DescriptionInfo.Description = totalTypeItem.Description;
			//     entity.DescriptionInfo.Translated = totalTypeItem.Description;
			//     entity.DescriptionInfo.DescriptionModified = true;
			//     entity.DescriptionInfo.Modified = true;
			// }
		}
		if (info.value === '' || info.value === null) {
			return this.validationUtils.createErrorObject('basics.procurementconfiguration.totalTypeNotNull');
		}
		if (typeof info.value === 'number') {
			return this.validationUtils.createErrorObject({
				key: 'basics.procurementconfiguration.isNumberError',
				params: { object: 'description' },
			});
		}
		return this.validationUtils.isUnique(this.dataService, info, this.dataService.getList());
	}
}
