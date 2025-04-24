/*
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { PlatformConfigurationService, ServiceLocator } from '@libs/platform/common';
import { BaseValidationService, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ProjectCostCodesDataService } from './project-cost-codes-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BasicsCostcodesHourfactorReadonlyProcessorService, ICostCodeEntity } from '@libs/basics/costcodes';
import { ProjectCostcodesProcessService } from './project-costcodes-process.service';
import { PrjCostCodesEntity } from '@libs/project/interfaces';


@Injectable({
	providedIn: 'root',
})

/**
 * Service for validating project cost codes.
 */
export abstract class ProjectCostCodesValidationService extends BaseValidationService<PrjCostCodesEntity> {
	protected dataService = inject(ProjectCostCodesDataService);
	protected http = inject(HttpClient);
	protected configService = inject(PlatformConfigurationService);
	private validationService = inject(BasicsSharedDataValidationService);
	private projectCostcodesProcessService = inject(ProjectCostcodesProcessService);

	private hourfactorReadonlyProcessor = inject(BasicsCostcodesHourfactorReadonlyProcessorService);

	/**
	 * Generates the validation functions for project cost codes.
	 * @returns An object containing the validation functions.
	 */
	protected generateValidationFunctions(): IValidationFunctions<PrjCostCodesEntity> {
		return {
			validateCode: this.validateCode,
			asyncValidateCode: this.asyncValidateCode,
			validateRate: this.validateRate,
			validateFactorCosts: this.validateFactorCosts,
			validateFactorQuantity: this.validateFactorQuantity,
			validateIsLabour: this.validateIsLabour,
			validateIsEditable: this.validateIsEditable,
			validateIsChildAllowed:this.validateIsChildAllowed
		};
	}

	/**
	 * Validates if the code is unique and mandatory.
	 * @param info Validation information for the project cost code entity.
	 * @returns ValidationResult indicating the validation result.
	 */
	protected validateCode(info: ValidationInfo<PrjCostCodesEntity>): ValidationResult {
		// TODO: Check whether this typecast is really safe  
		return this.validationService.isUniqueAndMandatory(info, this.dataService.getList() as PrjCostCodesEntity[]);
	}

	/**
	 * Asynchronously validates if the code is unique.
	 * @param info Validation information for the project cost code entity.
	 * @returns ValidationResult indicating the validation result.
	 */
	protected asyncValidateCode(info: ValidationInfo<PrjCostCodesEntity>): ValidationResult {
		const endPointURL: string = 'basics/costcodes/isuniqcode?' + 'code=' + info.value;
		const http = ServiceLocator.injector.get(HttpClient);
		const res = new ValidationResult();
		http.request<PrjCostCodesEntity>('GET', this.configService.webApiBaseUrl + endPointURL).subscribe((response) => {
			const isUniq = response;

			if (!isUniq) {
				res.valid = false;
				res.apply = true;
				res.error = '...';
				res.error = 'project.costcodes.uniqueCodeErrorMessage';
			} else {
				res.valid = true;
			}
		});
		return res;
	}

	/**
	 * Validates if the rate is mandatory.
	 * @param info Validation information for the project cost code entity.
	 * @returns ValidationResult indicating the validation result.
	 */
	protected validateRate(info: ValidationInfo<PrjCostCodesEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	/**
	 * Validates if the factor quantity is mandatory.
	 * @param info Validation information for the project cost code entity.
	 * @returns ValidationResult indicating the validation result.
	 */
	protected validateFactorCosts(info: ValidationInfo<PrjCostCodesEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	/**
	 * Validates if the factor quantity is mandatory.
	 * @param info Validation information for the project cost code entity.
	 * @returns ValidationResult indicating the validation result.
	 */
	protected validateFactorQuantity(info: ValidationInfo<PrjCostCodesEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	/**
	 * Validates if the factor quantity is mandatory.
	 * @param info Validation information for the project cost code entity.
	 * @returns ValidationResult indicating the validation result.
	 */
	public validateIsLabour(info: ValidationInfo<PrjCostCodesEntity>): ValidationResult {
		this.hourfactorReadonlyProcessor.setHourfactorReadonly(info.entity as ICostCodeEntity, true);
		if (!info.value) {
			(info.entity as ICostCodeEntity).FactorHour = 1;
		}

		return this.validateIsMandatory(info);
	}

	/**
	 * Validates if the factor quantity is mandatory.
	 * @param info Validation information for the project cost code entity.
	 * @returns ValidationResult indicating the validation result.
	 */
	public validateIsRate(info: ValidationInfo<PrjCostCodesEntity>): ValidationResult {
		this.hourfactorReadonlyProcessor.processIsEditable();

		return this.validationService.isMandatory(info);
	}

	/**
	 * Validates if the factor quantity is mandatory.
	 * @param info Validation information for the project cost code entity.
	 * @returns ValidationResult indicating the validation result.
	 */
	public validateIsEditable(info: ValidationInfo<PrjCostCodesEntity>): ValidationResult {
		this.hourfactorReadonlyProcessor.processIsEditable();
		return this.validationService.isMandatory(info);
	}

	/**
	 * Validates if the child is allowed for the given project cost code entity.
	 *
	 * @param info The validation information for the project cost code entity.
	 * @returns The result of the validation.
	 */
	public validateIsChildAllowed(info: ValidationInfo<PrjCostCodesEntity>): ValidationResult {
		const result = this.validationService.isMandatory(info);

		if (result) {
			info.entity.IsChildAllowed = info.value as boolean | undefined;

			this.projectCostcodesProcessService.processIsChildAllowed(info);
		}

		return result;
	}
}
