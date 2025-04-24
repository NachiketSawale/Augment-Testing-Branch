/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { isNil } from 'lodash';
import { IQtoMainHeaderGridEntity } from '../model/qto-main-header-grid-entity.class';
import { QtoMainHeaderGridDataService } from './qto-main-header-grid-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})

/**
 * qto header validation service
 */
export class QtoMainHeaderValidationService extends BaseValidationService<IQtoMainHeaderGridEntity> {
	protected readonly validationUtils = inject(BasicsSharedDataValidationService);

	public constructor(protected dataService: QtoMainHeaderGridDataService) {
		super();
	}

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IQtoMainHeaderGridEntity> {
		return this.dataService;
	}

	protected generateValidationFunctions(): IValidationFunctions<IQtoMainHeaderGridEntity> {
		return {
			Code: this.validateCode,
			PerformedFrom: this.validatePerformedFrom,
			PerformedTo: this.validatePerformedTo,
			BasRubricCategoryFk: this.validateBasRubricCategoryFk,
			ClerkFk: this.validateClerkFk,
			NoDecimals: this.validateNoDecimals,
			QtoTypeFk: this.validateQtoTypeFk,
		};
	}

	private validateCode(info: ValidationInfo<IQtoMainHeaderGridEntity>): ValidationResult {
		const itemList = this.dataService.getList();
		return this.validationUtils.isUniqueAndMandatory(info, itemList);
	}

	private validatePerformedFrom(info: ValidationInfo<IQtoMainHeaderGridEntity>): ValidationResult {
		const entity = info.entity;
		const value = (isNil(info.value) ? null : info.value) as Date;

		const result = this.validateDate(entity, value, entity.PerformedTo);
		return result ? result : this.validationUtils.createSuccessObject();
	}

	private validatePerformedTo(info: ValidationInfo<IQtoMainHeaderGridEntity>): ValidationResult {
		const entity = info.entity;
		const value = (isNil(info.value) ? null : info.value) as Date;

		const result = this.validateDate(entity, entity.PerformedFrom, value);
		return result ? result : this.validationUtils.createSuccessObject();
	}

	private validateDate(entity: IQtoMainHeaderGridEntity, fromDate: Date | null | undefined, toDate: Date | null | undefined): ValidationResult {
		let result = this.validationUtils.createSuccessObject();
		if (fromDate && toDate) {
			if (fromDate > toDate) {
				result = this.validationUtils.createErrorObject({
					key: 'qto.main.dateError',
				});
			}
		}

		this.validationUtils.applyValidationResult(this.dataService, {
			entity: entity,
			field: 'PerformedFrom',
			result: result,
		});

		this.validationUtils.applyValidationResult(this.dataService, {
			entity: entity,
			field: 'PerformedTo',
			result: result,
		});

		return result;
	}

	private async validateBasRubricCategoryFk(info: ValidationInfo<IQtoMainHeaderGridEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		const value = (isNil(info.value) ? 0 : info.value) as number;
		const code = await this.dataService.getCode(value, entity);
		const codeInfo = new ValidationInfo<IQtoMainHeaderGridEntity>(entity, code, 'Code');
		this.validateCode(codeInfo);
		entity.Code = code;

		//TODO: event onQtoHeaderRubricCatagoryChanged not ready -lnt
		// dataService.onQtoHeaderRubricCatagoryChanged.fire(entity);
		// dataService.gridRefresh();

		return this.validationUtils.createSuccessObject();
	}

	//TODO: missing => validateProjectFk, validatePackageFk, validatePackage2HeaderFK, validateConHeaderFk, validatePrcBoqFk, validatePrjBoqFk, validateOrdHeaderFk -lnt

	private validateClerkFk(info: ValidationInfo<IQtoMainHeaderGridEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info);
	}

	/**
	 * NoDecimals cell changed event
	 * @param info
	 * @private
	 */
	private validateNoDecimals(info: ValidationInfo<IQtoMainHeaderGridEntity>): ValidationResult {
		const entity = info.entity;
		if (!entity.NoDecimals || entity.NoDecimals === 0) {
			entity.NoDecimals = 3;
		}

		return this.validationUtils.createSuccessObject();
	}

	/**
	 * QtoTypeFk cell changed event
	 * @param info
	 * @private
	 */
	private validateQtoTypeFk(info: ValidationInfo<IQtoMainHeaderGridEntity>): ValidationResult {
		void this.dataService.getGoniometer(info.entity);

		return this.validationUtils.createSuccessObject();
	}
}
