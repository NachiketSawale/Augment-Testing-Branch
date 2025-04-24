/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ISalesTaxMatrixEntity } from '@libs/project/interfaces';
import { ProjectMainSalesTaxMatrixDataService } from './project-main-sales-tax-matrix-data.service';
import { ProjectMain2SalesTaxCodeDataService } from './project-main-2-sales-tax-code-data.service';
import { lastValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainSalesTaxMatrixValidationService extends BaseValidationService<ISalesTaxMatrixEntity> {

	private http = inject(HttpClient);
	private config = inject(PlatformConfigurationService);
	private projectMainSalesTaxMatrixDataService = inject(ProjectMainSalesTaxMatrixDataService);
	private project2SalesTaxCodeDataService = inject(ProjectMain2SalesTaxCodeDataService);


	protected generateValidationFunctions(): IValidationFunctions<ISalesTaxMatrixEntity> {
		return {
			SalesTaxGroupFk: this.validateSalesTaxGroupFkAsync
		};
	}

	private async validateSalesTaxGroupFkAsync(info: ValidationInfo<ISalesTaxMatrixEntity>): Promise<ValidationResult>{
		const selectedParentId = this.project2SalesTaxCodeDataService.getSelectedEntity()?.SalesTaxCodeFk;
		const result= new ValidationResult();
		if(info.entity && info.entity.SalesTaxGroupFk !== info.value && info.entity.Version === 0){
			const url = this.config.webApiBaseUrl + 'project/main/salestaxmatrix/gettaxpercentage?project2SalesTaxCodeFk=' + selectedParentId + '&salesTaxGroupFk=' + info.value;
			const response = await lastValueFrom(this.http.get<number>(url));

			if(response){
				info.entity.PrjTaxPercent = response;
				info.entity.TaxPercent = response;
				result.apply = true;
			}
		}

		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ISalesTaxMatrixEntity> {
		return this.projectMainSalesTaxMatrixDataService;
	}
}