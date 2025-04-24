/*
 * Copyright(c) RIB Software GmbH
 */

import { IEstColumnConfigDetailEntity } from '@libs/estimate/interfaces';
import { ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { EstimateMainColumnConfigDetailDataService } from './estimate-main-column-config-detail-data.service';
import { maxBy } from 'lodash';
import { BasicsSharedCostCodeLookupService, BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ColumnConfigColumnIdLookupDataService } from '../../../../lookups/column-config/column-config-column-id-lookup-data.service';
import { lastValueFrom } from 'rxjs';
import { ColumnConfigLineTypeLookupDataService } from '../../../../lookups/column-config/column-config-line-type-lookup-data.service';
import { ICostCodeEntity } from '@libs/basics/interfaces';

/**
 * The validation service for the EstimateMainColumnConfigDetail entity.
 */
@Injectable({
	providedIn: 'root',
})
export class EstimateMainColumnConfigDetailValidationService{
	private readonly validationUtils = inject(BasicsSharedDataValidationService);
	private readonly columnConfigDetailDataService = inject(EstimateMainColumnConfigDetailDataService);
	private readonly columnConfigColumnIdLookupDataService = inject(ColumnConfigColumnIdLookupDataService);
	private readonly columnConfigLineTypeLookupDataService = inject(ColumnConfigLineTypeLookupDataService);
	private readonly costCodeLookupService = inject(BasicsSharedCostCodeLookupService);

	/**
	 * Validates the ColumnId field of the given entity.
	 * @param {ValidationInfo<IEstColumnConfigDetailEntity>} info - The validation information.
	 * @returns {Promise<ValidationResult>} - The result of the validation.
	 */
	public async validateColumnId(info: ValidationInfo<IEstColumnConfigDetailEntity>): Promise<ValidationResult> {
		const entity = info.entity;
		//entity[info.field] = value;
		let validateResult = new ValidationResult();

		if (info.value) {
			if (info.value === 1) {
				entity.LineType = 2;
			}

			let isConflict = false;
			const configDetailList = this.columnConfigDetailDataService.getList();
			if (entity.LineType === 2) {
				const configMaterialList = configDetailList.filter(configDetail => {
					return configDetail.LineType === 2 && configDetail.ColumnId === entity.ColumnId && configDetail.Id !== entity.Id;
				});
				const configMaterialMax =  maxBy(configMaterialList, 'MaterialLineId');
				if (configMaterialMax && configMaterialMax.MaterialLineId) {
					entity.MaterialLineId = configMaterialMax.MaterialLineId > configMaterialList.length ? configMaterialMax.MaterialLineId + 1 : configMaterialList.length + 1;
				} else {
					entity.MaterialLineId = 1;
				}
				return validateResult;
			} else {
				const configCostCodeList = configDetailList.filter(configDetail => {
					return configDetail.ColumnId === entity.ColumnId && configDetail.Id !== entity.Id && configDetail.MdcCostCodeFk === entity.MdcCostCodeFk && configDetail.LineType === entity.LineType;
				});
				if (configCostCodeList && configCostCodeList.length > 0) {
					validateResult =this.validationUtils.isUniqueAndMandatory(info, configCostCodeList);
					isConflict = true;
				}
			}

			await this.lineTypeChange(entity, entity.LineType);
			this.removeValidationErrors(entity);
			//TODO-walt: implement processItem
			//configDetailProcessService.processItem(entity);
			this.columnConfigDetailDataService.verifyColumnConfigListStatus(isConflict);
		}

		return validateResult;
	}

	/**
	 * Validates the LineType field of the given entity.
	 * @param {ValidationInfo<IEstColumnConfigDetailEntity>} info - The validation information.
	 * @returns {Promise<ValidationResult>} - The result of the validation.
	 */
	public async validateLineType(info: ValidationInfo<IEstColumnConfigDetailEntity>) {
		//entity[model] = value;
		await this.lineTypeChange(info.entity, info.value as number);
		//TODO-walt: implement processItem
		//configDetailProcessService.processItem(entity);

		return this.validationUtils.isMandatory(info);
	}

	/**
	 * Validates the MdcCostCodeFk field of the given entity.
	 * @param {ValidationInfo<IEstColumnConfigDetailEntity>} info - The validation information.
	 * @returns {Promise<ValidationResult>} - The result of the validation.
	 */
	public async validateMdcCostCodeFk(info: ValidationInfo<IEstColumnConfigDetailEntity>) {
		//entity[model] = entity[model + 'Description'] = value;
		const entity = info.entity;
		let validateResult = new ValidationResult();

		if (!this.validationUtils.isEmptyProp(info.value)) {
			if (entity.LineType === 1) {
				await this.setColumnHeaderDescription(entity);
			}
		}

		const configDetailList = this.columnConfigDetailDataService.getList();
		const configCostCodeList = configDetailList.filter((configDetail) => {
			return configDetail.LineType === 1 && configDetail.ColumnId === entity.ColumnId && configDetail.Id !== entity.Id && configDetail.MdcCostCodeFk === entity.MdcCostCodeFk;
		});
		let isConflict = false;
		if (configCostCodeList && configCostCodeList.length > 0) {
			validateResult = this.validationUtils.isUniqueAndMandatory(info, configCostCodeList);
			isConflict = true;
		} else {
			validateResult = this.validationUtils.isMandatory(info);
		}
		this.removeValidationErrors(entity);
		//TODO-walt: implement processItem
		//configDetailProcessService.processItem(entity);
		this.columnConfigDetailDataService.verifyColumnConfigListStatus(isConflict);
		return validateResult;
	}

	/**
	 * Validates the MaterialLineId field of the given entity.
	 * @param {ValidationInfo<IEstColumnConfigDetailEntity>} info - The validation information.
	 * @returns {Promise<ValidationResult>} - The result of the validation.
	 */
	public async validateMaterialLineId(info: ValidationInfo<IEstColumnConfigDetailEntity>) {
		const entity = info.entity;
		//entity[model] = value;
		let validateResult = new ValidationResult();

		if (!this.validationUtils.isEmptyProp(info.value)){
			if (entity.LineType === 2){
				const configDetailList = this.columnConfigDetailDataService.getList();
				const configMaterialList = configDetailList.filter(configDetail => {
					return configDetail.LineType === 2 && configDetail.ColumnId === entity.ColumnId && configDetail.Id !== entity.Id;
				});
				if (configMaterialList){
					validateResult = this.validationUtils.isUniqueAndMandatory(info, configMaterialList);
					await this.setColumnHeaderDescription(entity);
				}
			}
		}else{
			validateResult = this.validationUtils.isMandatory(info);
		}

		this.removeValidationErrors(entity);
		this.columnConfigDetailDataService.verifyColumnConfigListStatus();

		return validateResult;
	}

	/**
	 * Validates the DescriptionInfo field of the given entity.
	 * @param {ValidationInfo<IEstColumnConfigDetailEntity>} info - The validation information.
	 * @returns {ValidationResult} - The result of the validation.
	 */
	public validateDescriptionInfo(info: ValidationInfo<IEstColumnConfigDetailEntity>) {
		const entity = info.entity;
		if(entity.DescriptionInfo && info.value){
			entity.DescriptionInfo.Description = info.value as string;
		}

		this.columnConfigDetailDataService.verifyColumnConfigListStatus();
		return this.validationUtils.isMandatory(info);
		//TODO-walt: implement applyValidationResult
		//this.validationUtils.applyValidationResult(result, entity, 'DescriptionInfo');
	}

	/**
	 * Validates the DescriptionInfo field of the given entity.
	 * @param {ValidationInfo<IEstColumnConfigDetailEntity>} info - The validation information.
	 * @returns {ValidationResult} - The result of the validation.
	 */
	private async lineTypeChange(entity: IEstColumnConfigDetailEntity, value?: number | null){
		if (value){
			if (value === 1){
				entity.MdcCostCodeFk = entity.MdcCostCodeFk ? entity.MdcCostCodeFk: null;
				entity.MaterialLineId = 0;
			}else if (value === 2){
				const configDetailList = this.columnConfigDetailDataService.getList();
				const configMaterialList = configDetailList.filter(configDetail => {
					return configDetail.LineType === 2 && configDetail.ColumnId === entity.ColumnId && configDetail.Id !== entity.Id;
				});

				entity.MdcCostCodeFk = null;
				const configMaterialMax =  maxBy(configMaterialList, 'MaterialLineId');
				if(configMaterialMax && configMaterialMax.MaterialLineId){
					entity.MaterialLineId = configMaterialMax.MaterialLineId > configMaterialList.length ? configMaterialMax.MaterialLineId + 1 : configMaterialList.length + 1;
				} else {
					entity.MaterialLineId = entity.MaterialLineId ? entity.MaterialLineId: 1;
				}
			}
			this.removeValidationErrors(entity);
			await this.setColumnHeaderDescription(entity);
		}

		this.columnConfigDetailDataService.verifyColumnConfigListStatus();
	}

	/**
	 * Removes validation errors from the given entity.
	 * @param {IEstColumnConfigDetailEntity} item - The entity to remove the validation errors from.
	 */
	private removeValidationErrors(item: IEstColumnConfigDetailEntity){
		const fields = ['ColumnId', 'MaterialLineId', 'MdcCostCodeFk', 'DescriptionInfo'];
		fields.forEach((field) => {
			//ToDo-Walt: remove errors
			// if (runtimeDataService.hasError(item, field)/* && !platformDataValidationService.isEmptyProp(item[field]) */){
			// 	delete item.__rt$data.errors[field];
			// }
		});
	}

	/**
	 * Sets the column header description for the given entity.
	 * @param {IEstColumnConfigDetailEntity} item - The entity to set the column header description
	 * @returns {Promise<void>} - The promise of the operation.
	 */
	private async setColumnHeaderDescription(item: IEstColumnConfigDetailEntity){
		if(item.ColumnId && item.LineType){
			const colId = await lastValueFrom(this.columnConfigColumnIdLookupDataService.getItemByKey({ id: item.ColumnId}));
			const lineTypeInfo = await lastValueFrom(this.columnConfigLineTypeLookupDataService.getItemByKey({id: item.LineType}));
			let costCodeLookup : ICostCodeEntity | null = null;
			if(item.MdcCostCodeFk){
				costCodeLookup = await lastValueFrom(this.costCodeLookupService.getItemByKey({id: item.MdcCostCodeFk}));
			}

			if (colId && lineTypeInfo && lineTypeInfo.DescriptionInfo){
				let description = '';
				if (item.LineType === 1){ // CostCodes
					description = costCodeLookup ? costCodeLookup.Code: '';
				}else if (item.LineType === 2 && item.MaterialLineId){ // Material
					description = item.MaterialLineId.toString();
				}

				let columnHeaderDescription = colId.DescriptionInfo?.Description + ' ('  + description + '-' + lineTypeInfo.DescriptionInfo.Description + ')';
				if (columnHeaderDescription.length > 42){
					columnHeaderDescription = columnHeaderDescription.substring(0, 41) + ')';
				}
				if(item.DescriptionInfo){
					item.DescriptionInfo.Description = item.DescriptionInfo.Translated = columnHeaderDescription;
				}
			}
		}
	}
}