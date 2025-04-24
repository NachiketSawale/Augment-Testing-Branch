import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PropertyType } from '@libs/platform/common';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ICompanyCostDataEntity } from '../../model/entities/company-cost-data-entity.interface';
import { ControllingActualsCostDataDataService } from '../controlling-actuals-cost-data-data.service';
import { find, get, set, forEach } from 'lodash';

/**
 * ActualsCostData validation service
 */
export class ControllingActualsCostDataValidationService extends BaseValidationService<ICompanyCostDataEntity> {
	private http = inject(HttpClient);
	private dataService = inject(ControllingActualsCostDataDataService);
	private configurationService = inject(PlatformConfigurationService);
	private validationUtils = inject(BasicsSharedDataValidationService);
	public constructor(private controllingActualsCostDataDataService: ControllingActualsCostDataDataService) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<ICompanyCostDataEntity> {
		return {
			AccountFk: this.validateAccountFk,
			MdcControllingUnitFk: this.validateMdcControllingUnitFk,
			MdcContrCostCodeFk: this.validateMdcContrCostCodeFk,
			MdcCostCodeFk: this.validateMdcCostCodeFk,
			CurrencyFk: this.validateCurrencyFk,
			UomFk: this.validateUomFk,
			NominalDimension1: this.validateNominalDimension1,
			NominalDimension2: this.validateNominalDimension2,
			NominalDimension3: this.validateNominalDimension3,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICompanyCostDataEntity> {
		return this.dataService;
	}

	/*
    // Verify that uom is empty
    */
	private validateUomFk(info: ValidationInfo<ICompanyCostDataEntity>): ValidationResult {
		// const entity = info.entity;
		const result = this.validationUtils.isMandatory(info);
		// todo: jun : pls check these fields
		// if (result.valid) {
		// 	entity.BasUomPriceUnitFk = info.value as number;
		// 	entity.FactorPriceUnit = 1;
		// }
		return result;
	}
	/*
   //  Verify that Currency is empty
   */
	private validateCurrencyFk(info: ValidationInfo<ICompanyCostDataEntity>): ValidationResult {
		// todo: jun : pls check the code
		// const entity = info.entity;
		const result = this.validationUtils.isMandatory(info);
		// if (result.valid) {
		// 	entity.BasUomPriceUnitFk = info.value as number;
		// 	entity.FactorPriceUnit = 1;
		// }
		return result;
	}
	/*
	 * Check the cost data column MdcControllingUnitFk
	 */
	private validateMdcControllingUnitFk(info: ValidationInfo<ICompanyCostDataEntity>): ValidationResult {
		const entity = info.entity;
		let result = this.validationUtils.isMandatory(info);
		if (result.valid) {
			result = this.checkRepeated(entity, info.value, 'MdcControllingUnitFk');
		}
		return result;
	}

	/*
	 * Check the cost data column MdcCostCodeFk
	 */
	private validateMdcCostCodeFk(info: ValidationInfo<ICompanyCostDataEntity>): ValidationResult {
		const entity = info.entity;
		let result = this.validationUtils.isMandatory(info);
		const mdcCostCode = this.dataService.getParent();
		// todo : jun
		// let fieldErrorTr = { fieldName: 'Cost Code' };
		if (info.value === -1) {
			result = this.validationUtils.isMandatory(info);
			if (mdcCostCode !== undefined && mdcCostCode.HasCostCode === false) {
				result.valid = true;
			} else {
				if (entity.MdcCostCodeFk !== null) {
					result.valid = true;
				}
			}

			if (result.valid) {
				result = this.checkRepeated(entity, info.value, 'MdcCostCodeFk');
			}

			return result;
		} else {
			result = this.validationUtils.isMandatory(info);
			if (mdcCostCode !== undefined && mdcCostCode.HasCostCode === false) {
				result.valid = true;
			} else {
				if (entity.MdcCostCodeFk !== null) {
					result.valid = true;
				}
			}

			if (result.valid) {
				result = this.checkRepeated(entity, info.value, 'MdcCostCodeFk');
			}

			return result;
		}
		return result;
	}
	/*
	 * Check the cost data column MdcContrCostCodeFk
	 */
	private validateMdcContrCostCodeFk(info: ValidationInfo<ICompanyCostDataEntity>): ValidationResult {
		const entity = info.entity;
		let result = this.validationUtils.isMandatory(info);
		const mdcContCostCode = this.dataService.getParent();
		// let fieldErrorTr = { fieldName: 'Controlling Cost Code' };
		if (info.value === -1) {
			result = this.validationUtils.isMandatory(info);
			if (mdcContCostCode !== undefined && mdcContCostCode.HasContCostCode === false) {
				result.valid = true;
			} else {
				if (entity.MdcContrCostCodeFk !== null) {
					result.valid = true;
				}
			}

			if (result.valid) {
				result = this.checkRepeated(entity, info.value, 'MdcContrCostCodeFk');
			}

			return result;
		} else {
			result = this.validationUtils.isMandatory(info);
			if (mdcContCostCode !== undefined && mdcContCostCode.HasContCostCode === false) {
				result.valid = true;
			} else {
				if (entity.MdcContrCostCodeFk !== null) {
					result.valid = true;
				}
			}

			if (result.valid) {
				result = this.checkRepeated(entity, info.value, 'MdcContrCostCodeFk');
			}

			return result;
		}
		return result;
	}
	/*
	 * Check the cost data column AccountFk
	 */
	private validateAccountFk(info: ValidationInfo<ICompanyCostDataEntity>): ValidationResult {
		const entity = info.entity;
		let result = this.validationUtils.isMandatory(info);
		const account = this.dataService.getParent();
		// let fieldErrorTr = { fieldName: 'Account' };

		if (info.value === -1) {
			result = this.validationUtils.isMandatory(info);
			if (account !== undefined && account.HasAccount === false) {
				result.valid = true;
			} else {
				if (entity.AccountFk !== null) {
					result.valid = true;
				}
			}

			if (result.valid) {
				result = this.checkRepeated(entity, info.value, 'AccountFk');
			}

			return result;
		} else {
			result = this.validationUtils.isMandatory(info);
			if (account !== undefined && account.HasAccount === false) {
				result.valid = true;
			} else {
				if (entity.AccountFk !== null) {
					result.valid = true;
				}
			}

			if (result.valid) {
				result = this.checkRepeated(entity, info.value, 'AccountFk');
			}

			return result;
		}
		return result;
	}
	/*
    Check for duplication
     */
	public checkRepeated(entity: ICompanyCostDataEntity, value: PropertyType | undefined, field: string) {
		set(entity, field, value);
		this.addRepeatCheckKey(entity);

		const item = find(this.dataService.getList(), function (item) {
			return get(item, 'RepeatCheckKey') === entity.RepeatCheckKey && item.Id !== entity.Id;
		});

		if (item) {
			return this.validationUtils.createErrorObject({
				key: 'controlling.actuals.errorDataRepeatRecordKey',
				params: { object: field.toLowerCase() },
			});
		}

		this.clearRepeatError(entity, field);
		return this.validationUtils.createSuccessObject();
	}
	/*
    The data combination column is checked repeatedly
    */
	public addRepeatCheckKey = function (entity: ICompanyCostDataEntity) {
		// key: CompanyFk_ProjectFk_ValueTypeFk_CompanyYearFk_CompanyPeriodFk
		entity.RepeatCheckKey = entity.CompanyFk + '_' + (entity.ProjectFk || 0) + '_' + (entity.ValueTypeFk || 0) + '_' + (entity.CompanyYearFk || 0) + '_' + (entity.CompanyPeriodFk || 0);
	};
	/*
   clear Repeat Error
   */
	public clearRepeatError(entity: ICompanyCostDataEntity, field: string) {
		// if (entity.__rt$data && entity.__rt$data.errors) {
		const columns = ['MdcControllingUnitFk', 'MdcCostCodeFk', 'MdcContrCostCodeFk', 'AccountFk', 'NominalDimension1', 'NominalDimension2', 'NominalDimension3'];
		forEach(columns, (column) => {
			if (column !== field) {
				// if (entity.__rt$data.errors[column] && entity.__rt$data.errors[column].error$tr$ === 'controlling.actuals.errorDataRepeatRecordKey') {
				// 	delete entity.__rt$data.errors[column];

				// should finish the validation with function like platformDataValidationService.finishValidation
				this.validationUtils.createSuccessObject();
				// }
			}
		});
		// }
	}
	/*
	 * Check the cost data column NominalDimension1
	 */
	private validateNominalDimension1(info: ValidationInfo<ICompanyCostDataEntity>): ValidationResult {
		// todo: jun : should finish the validation with function like platformDataValidationService.finishValidation
		// const result = this.checkRepeated(info.entity, info.value, 'NominalDimension1');
		return this.validationUtils.createSuccessObject();
	}
	/*
	 *Check the cost data column NominalDimension2
	 */
	private validateNominalDimension2(info: ValidationInfo<ICompanyCostDataEntity>): ValidationResult {
		// todo: jun : should finish the validation with function like platformDataValidationService.finishValidation
		// let result = this.checkRepeated(info.entity, info.value, 'NominalDimension2');
		return this.validationUtils.createSuccessObject();
	}
	/*
	 * Check the cost data column NominalDimension3
	 */
	private validateNominalDimension3(info: ValidationInfo<ICompanyCostDataEntity>): ValidationResult {
		// todo: jun : should finish the validation with function like platformDataValidationService.finishValidation
		// let result = this.checkRepeated(info.entity, info.value, 'NominalDimension3');
		return this.validationUtils.createSuccessObject();
	}
}
