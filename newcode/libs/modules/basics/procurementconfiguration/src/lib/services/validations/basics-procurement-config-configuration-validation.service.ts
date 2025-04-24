/*
 * Copyright(c) RIB Software GmbH
 */

import { firstValueFrom } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsProcurementConfigConfigurationDataService } from '../basics-procurement-config-configuration-data.service';
import { IDescriptionInfo, PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { BasicsProcurementConfigRubricCategoryDataService } from '../basics-procurement-config-rubric-category-data.service';
import { BasicsProcurementConfigurationHeaderDataService } from '../basics-procurement-configuration-header-data.service';
import { IPrcConfigurationEntity } from '../../model/entities/prc-configuration-entity.interface';

/**
 * The validation service of procurement configuration container.
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementConfigConfigurationValidationService extends BaseValidationService<IPrcConfigurationEntity> {
	private dataService = inject(BasicsProcurementConfigConfigurationDataService);
	private validationUtils = inject(BasicsSharedDataValidationService);
	private http = inject(HttpClient);
	private config = inject(PlatformConfigurationService);
	private rubricCategoryService = inject(BasicsProcurementConfigRubricCategoryDataService);
	private configHeaderService = inject(BasicsProcurementConfigurationHeaderDataService);

	protected generateValidationFunctions(): IValidationFunctions<IPrcConfigurationEntity> {
		return {
			IsDefault: this.validateIsDefault,
			DescriptionInfo: this.validateDescriptionInfo,
			BaselineIntegration: this.validateBaselineIntegration,
		};
	}

	protected getEntityRuntimeData():IEntityRuntimeDataRegistry<IPrcConfigurationEntity> {
		return this.dataService;		
	}

	protected validateIsDefault(info: ValidationInfo<IPrcConfigurationEntity>): ValidationResult {
		return this.validationUtils.validateIsDefault(info, this.dataService, { RubricCategoryFk: info.entity.RubricCategoryFk });
	}

	protected validateDescriptionInfo(info: ValidationInfo<IPrcConfigurationEntity>): ValidationResult {
		return this.validationUtils.isUniqueAndMandatory(
			{
				entity: info.entity,
				value: info.value ? (info.value as IDescriptionInfo).Translated : '',
				field: `${info.field}.Translated`,
			},
			this.dataService.getList(),
		);
	}

	protected async validateBaselineIntegration(info: ValidationInfo<IPrcConfigurationEntity>): Promise<ValidationResult> {
		if (this.dataService.getList().some((e) => e.BaselineIntegration)) {
			return this.validationUtils.createErrorObject({
				key: 'basics.procurementconfiguration.BaselineIntegrationAssignErrorMessage',
				params: {
					object: info.field.toLowerCase(),
				},
			});
		}

		const endpoint = this.config.webApiBaseUrl + 'basics/procurementconfiguration/configuration/isAssignedBaselineIntegrationInOnce';
		const rubricCategory = this.rubricCategoryService.getSelection()[0];
		const configHeader = this.configHeaderService.getSelection()[0];

		const isAssignedBaselineIntegrationInOnce = await firstValueFrom(
			this.http.get(endpoint, {
				params: {
					id: info.entity.Id,
					prcConfigHeaderId: configHeader.Id,
					rubricCategoryId: rubricCategory.Id,
					baselineIntegration: info.value as boolean,
				},
			}),
		);

		if (!isAssignedBaselineIntegrationInOnce) {
			return this.validationUtils.createErrorObject({
				key: 'cloud.common.uniqueValueErrorMessage',
				params: {
					object: info.field.toLowerCase(),
				},
			});
		}

		return this.validationUtils.createSuccessObject();
	}
}
