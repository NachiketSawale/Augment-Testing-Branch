/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ProjectCostCodesDataService } from './project-cost-codes-data.service';
import { ProjectCostCodesJobRateDataService } from './project-cost-codes-job-rate-data.service';
import { IProjectCostCodesJobRateEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root',
})

/**
 * @name projectCostCodesJobRateValidationService
 * @description provides validation methods for project costcodes job rate properties
 */
export abstract class ProjectCostcodesJobRateValidationService extends BaseValidationService<IProjectCostCodesJobRateEntity> {
	protected http = inject(HttpClient);
	protected configService = inject(PlatformConfigurationService);
	private parentService: ProjectCostCodesDataService = inject(ProjectCostCodesDataService);
	private validationService = inject(BasicsSharedDataValidationService);
	private dataService = inject(ProjectCostCodesJobRateDataService);

	protected generateValidationFunctions(): IValidationFunctions<IProjectCostCodesJobRateEntity> {
		return {
			validateRate: this.validateRate,
			validateFactorCosts: this.validateFactorCosts,
			validateFactorQuantity: this.validateFactorQuantity,
			validateLgmJobFk: this.validateLgmJobFk,
		};
	}
	/**
	 * Validates the rate of the given information.
	 * @param info The information to validate.
	 * @returns The validation result.
	 */
	protected validateRate(info: ValidationInfo<IProjectCostCodesJobRateEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	/**
	 * Validates the factor costs of the given information.
	 * @param info The information to validate.
	 * @returns The validation result.
	 */
	public validateFactorCosts(info: ValidationInfo<IProjectCostCodesJobRateEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	/**
	 * Validates the factor quantity of the given information.
	 * @param info The information to validate.
	 * @returns The validation result.
	 */
	public validateFactorQuantity(info: ValidationInfo<IProjectCostCodesJobRateEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	/**
	 * Validates the LGM job foreign key of the given information.
	 * @param info The information to validate.
	 * @returns The validation result.
	 */
	public validateLgmJobFk(info: ValidationInfo<IProjectCostCodesJobRateEntity>): ValidationResult {
		const items = this.dataService.getList();
		const itemsByJob = items.filter((item) => {
			return item.LgmJobFk == info.value && item['ProjectCostCodes'] == info.entity.ProjectCostCodeFk;
		});

		return this.validationService.isUniqueAndMandatory(info, itemsByJob);
	}

	/**
	 * Asynchronously validates the LGM job foreign key of the given information.
	 * @param info The information to validate.
	 */
	public asyncValidateLgmJobFk(info: ValidationInfo<IProjectCostCodesJobRateEntity>) {
		const selectedCostCodeItem = this.parentService.getSelection()[0];
		const mdcCostCodeId = selectedCostCodeItem && selectedCostCodeItem.Id == info.entity.ProjectCostCodeFk && selectedCostCodeItem.MdcCostCodeFk ? selectedCostCodeItem.MdcCostCodeFk : 0;

		const endPointURL: string = 'project/costcodes/job/rate/getpricebyjobId=' + info.value + '&mdcCostCodeId=' + mdcCostCodeId;
		const http = ServiceLocator.injector.get(HttpClient);

		http.request<IProjectCostCodesJobRateEntity>('GET', this.configService.webApiBaseUrl + endPointURL).subscribe((response) => {
			const priceEntity = response;

			if (priceEntity) {
				info.entity.Rate = priceEntity.Rate;
				info.entity.CurrencyFk = priceEntity.CurrencyFk;
				info.entity.FactorCosts = priceEntity.FactorCosts;
				info.entity.RealFactorCosts = priceEntity.RealFactorCosts;
				info.entity.FactorQuantity = priceEntity.FactorQuantity;
				info.entity.RealFactorQuantity = priceEntity.RealFactorQuantity;
				info.entity.FactorHour = priceEntity.FactorHour;
				info.entity.Co2Source = priceEntity.Co2Source;
				info.entity.Co2Project = priceEntity.Co2Project;
				info.entity.Co2SourceFk = priceEntity.Co2SourceFk;
			}
		});
	}

	/**
	 * Validates and updates project cost codes job rates asynchronously.
	 */

	public asyncValidateFactorCosts(info: ValidationInfo<IProjectCostCodesJobRateEntity>) {
		this.asyncValidateRealFactor(info);
	}

	/**
	 * Initiates the asynchronous validation of factor quantity.
	 *
	 * @param {ValidationInfo<IProjectCostCodesJobRateEntity>} info - The validation information containing the entity to validate.
	 */
	public asyncValidateFactorQuantity(info: ValidationInfo<IProjectCostCodesJobRateEntity>) {
		this.asyncValidateRealFactor(info);
	}

	/**
	 * Asynchronously validates the real factor of the given information.
	 */
	public asyncValidateRealFactor(info: ValidationInfo<IProjectCostCodesJobRateEntity>) {
		// let asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, projectCostCodesJobRateService);                                   // need to check with platformModuleStateService modstate and assertpath function
		// 			asyncMarker.myPromise = projectCostCodesJobRateService.calcRealFactorsNew(entity, value, model).then(function (updateCostJobRates) {               // calcRealFactorsNew is implementation is pending
		// 				if (updateCostJobRates && updateCostJobRates.length) {
		// 					let parentService = projectCostCodesJobRateService.parentService();
		// 					let parentSelected = parentService.getSelected();
		// 					let modState = platformModuleStateService.state(parentService.getModule());
		// 					let parentItemName = parentService.getItemName();
		// 					let itemName = projectCostCodesJobRateService.getItemName();
		// 					let parentState = parentService.assertPath(modState.modifications, false, parentSelected);
		// 					if (parentState[parentItemName + 'ToSave'] && _.isArray(parentState[parentItemName + 'ToSave'])) {
		// 						_.forEach(parentState[parentItemName + 'ToSave'], function (prjCostCodeToSave) {
		// 							let currentCostJobRate = _.find(updateCostJobRates, {'ProjectCostCodeFk': prjCostCodeToSave.MainItemId,});
		// 							if (currentCostJobRate) {
		// 								if (!prjCostCodeToSave[itemName + 'ToSave']) {
		// 									prjCostCodeToSave[itemName + 'ToSave'] = [];
		// 								}
		// 								let changeJobRate = projectCostCodesJobRateService.findJobRate(prjCostCodeToSave[itemName + 'ToSave'], currentCostJobRate);
		// 								if (changeJobRate) {
		// 									projectCostCodesJobRateService.mergeCostCodeJob(changeJobRate, currentCostJobRate);
		// 								} else {
		// 									prjCostCodeToSave[itemName + 'ToSave'].push(currentCostJobRate);
		// 								}
		// 							}
		// 						});
		// 					}
		// 				}
	}

	/**
	 * Retrieves the runtime data registry for project cost codes job rate entities.
	 */
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectCostCodesJobRateEntity> {
		return this.dataService;
	}
}
