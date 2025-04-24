/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo,
	IReadOnlyField
} from '@libs/platform/data-access';
import { BasicsMaterialStockDataService } from './basics-material-stock-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IMaterial2ProjectStockEntity } from '../model/entities/material-2-project-stock-entity.interface';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';


interface IMaterialProjectStockUniqueResponse {
	ProjectId?: number;
	IsUnique: boolean;
}

/**
 * Material Stock validation service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsMaterialStockValidationService extends BaseValidationService<IMaterial2ProjectStockEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(BasicsMaterialStockDataService);
	private translationService: PlatformTranslateService = inject(PlatformTranslateService);
	private configService = inject(PlatformConfigurationService);
	private http = inject(HttpClient);

	protected generateValidationFunctions(): IValidationFunctions<IMaterial2ProjectStockEntity> {
		return {
			ProjectStockFk: this.validateProjectStockFk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMaterial2ProjectStockEntity> {
		return this.dataService;
	}

	protected async validateProjectStockFk(info: ValidationInfo<IMaterial2ProjectStockEntity>) {
		if (!info.value || info.value === 0) {
			this.setProvisionReadOnly(info.entity, true);
		}
		const result = this.validationUtils.isUniqueAndMandatory(info, this.dataService.getList(), 'cloud.common.entityStock');
		if (!result.valid) {
			return result;
		}
		let isProvisionAllowed = false;
		if (info.value) {
			const isProvision = await firstValueFrom(this.http.get(`${this.configService.webApiBaseUrl}project/stock/material/getprovisionallowed`, {
				params: {
					projectStockId: info.value as number
				}
			}));
			isProvisionAllowed = !!isProvision;
		}
		this.setProvisionReadOnly(info.entity, !isProvisionAllowed);
		if (!isProvisionAllowed) {
			info.entity.ProvisionPercent = 0;
			info.entity.ProvisionPeruom = 0;
		}

		if (result.valid && info.value) {
			const response = await firstValueFrom(this.http.get(`${this.configService.webApiBaseUrl}basics/material/material2projectstock/isunique`, {
				params: {
					projectStockId: info.value as number,
					mainItemId: info.entity?.Id,
					Id: info.entity?.Id,
				}
			})) as IMaterialProjectStockUniqueResponse;
			if (response.ProjectId) {
				info.entity.ProjectFk = response.ProjectId;
				this.setStockLocationFkReadOnly(info.entity, false);
			}
			if (response.IsUnique) {
				this.setStockLocationFkReadOnly(info.entity, true);
				return this.validationUtils.createErrorObject({
					key: 'cloud.common.uniqueValueErrorMessage',
					params: {fieldName: this.translationService.instant('cloud.common.entityStock').text},
				});
			}
		} else {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.emptyOrNullValueErrorMessage',
				params: {fieldName: this.translationService.instant('cloud.common.entityStock').text},
			});
		}
		return result;
	}

	private setProvisionReadOnly(entity: IMaterial2ProjectStockEntity, isReadOnly: boolean){
		const readonlyFields: IReadOnlyField<IMaterial2ProjectStockEntity>[] = [
			{field: 'ProvisionPercent', readOnly: isReadOnly},
			{field: 'ProvisionPeruom', readOnly: isReadOnly}];
		this.dataService.setEntityReadOnlyFields(entity, readonlyFields);
	}

	private setStockLocationFkReadOnly(entity: IMaterial2ProjectStockEntity, isReadOnly: boolean): void {
		const readonlyFields: IReadOnlyField<IMaterial2ProjectStockEntity>[] = [{field: 'StockLocationFk', readOnly: isReadOnly}];
		this.dataService.setEntityReadOnlyFields(entity, readonlyFields);
	}
}