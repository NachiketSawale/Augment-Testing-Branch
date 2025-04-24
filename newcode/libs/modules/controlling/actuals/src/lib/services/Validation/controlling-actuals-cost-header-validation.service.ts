import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ICompanyCostHeaderEntity } from '../../model/entities/company-cost-header-entity.interface';
import { ControllingActualsCostHeaderDataService } from '../controlling-actuals-cost-header-data.service';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { map, Observable } from 'rxjs';

export class ControllingActualsCostHeaderValidationService extends BaseValidationService<ICompanyCostHeaderEntity> {
	private http = inject(HttpClient);
	private dataService = inject(ControllingActualsCostHeaderDataService);
	private configurationService = inject(PlatformConfigurationService);
	private validationUtils = inject(BasicsSharedDataValidationService);
	public constructor(private controllingActualsCostHeaderDataService: ControllingActualsCostHeaderDataService) {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<ICompanyCostHeaderEntity> {
		return {
			Code: this.validateCode,
			HasAccount: this.validateHasAccount,
			HasCostCode: this.validateHasCostCode,
			HasContCostCode: this.validateHasContCostCode,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICompanyCostHeaderEntity> {
		return this.dataService;
	}
	private validateCode(info: ValidationInfo<ICompanyCostHeaderEntity>): Promise<ValidationResult> {
		return new Promise((resolve) => {
			const list = this.dataService.getList();
			const result = this.validationUtils.isUniqueAndMandatory(info, list);
			if (!result.valid) {
				resolve(result);
			} else {
				const entity = info.entity;
				this.checkIsUniqueCostHeaderCode(entity.Code).subscribe((isUnique) => {
					if (!isUnique) {
						resolve(this.validationUtils.createErrorObject({ key: 'basics.material.error.materialCodeUniqueError' }));
					} else {
						resolve(this.validationUtils.createSuccessObject());
					}
				});
			}
		});
	}
	private checkIsUniqueCostHeaderCode(code: string | null | undefined): Observable<boolean> {
		return this.http.get(this.configurationService.webApiBaseUrl + 'controlling/actuals/costheader/list').pipe(
			map((res) => {
				return res as boolean;
			}),
		);
	}
	private validateHasCostCode(info: ValidationInfo<ICompanyCostHeaderEntity>): Promise<ValidationResult> {
		if (info.entity.HasCostCode) {
			info.entity.HasAccount = false;
			info.entity.HasContCostCode = false;
		}
		return new Promise((resolve) => {
			true;
		});
	}
	private validateHasAccount(info: ValidationInfo<ICompanyCostHeaderEntity>): Promise<ValidationResult> {
		if (info.entity.HasAccount) {
			info.entity.HasCostCode = false;
			info.entity.HasContCostCode = false;
		}
		return new Promise((resolve) => {
			true;
		});
	}
	private validateHasContCostCode(info: ValidationInfo<ICompanyCostHeaderEntity>): Promise<ValidationResult> {
		if (info.entity.HasContCostCode) {
			info.entity.HasCostCode = false;
			info.entity.HasAccount = false;
		}
		return new Promise((resolve) => {
			true;
		});
	}
}
