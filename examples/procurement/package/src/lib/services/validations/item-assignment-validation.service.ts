/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IPrcItemAssignmentEntity } from '@libs/procurement/interfaces';
import { ProcurementPackageItemAssignmentDataService } from '../item-assignment-data.service';
import { cloneDeep, set, merge, get } from 'lodash';
import {BasicsSharedDataValidationService} from '@libs/basics/shared';
import { PlatformTranslateService } from '@libs/platform/common';
import { MODULE_INFO_PROCUREMENT } from '@libs/procurement/common';

interface IFieldStatus {
	EstHeaderFk: string;
	EstLineItemFk: string;
	BoqItemFk: string;
	EstResourceFk: string;
	PrcItemFk: string;
}

@Injectable({
	providedIn: 'root',
})
export class ProcurementPackageItemAssignmentValidationService extends BaseValidationService<IPrcItemAssignmentEntity> {
	private readonly itemAssignmentService = inject(ProcurementPackageItemAssignmentDataService);
	private readonly validationService = inject(BasicsSharedDataValidationService);
	private readonly translationService = inject(PlatformTranslateService);
	// private readonly itemLookupService = inject(ProcurementCommonItemLookupService);
	private readonly duplicateEntityIdContainer: number[][] = [];
	private readonly fieldStatusCache: { [key: string]: IFieldStatus } = {};
	private readonly status = {
		valid: 'valid',
		errorEmptyOrNull: 'errorEmptyOrNull',
		errorEstResourceWithBoQ: 'errorEstResourceWithBoQ',
		errorBoqNotPosition: 'errorBoqNotPosition',
		errorDifferentMaterialFk: 'errorDifferentMaterialFk',
		errorDifferentMaterialDescription: 'errorDifferentMaterialDescription',
		errorIsNotUnique: 'errorIsNotUnique',
	};

	public getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPrcItemAssignmentEntity> {
		return this.itemAssignmentService;
	}

	protected override generateValidationFunctions(): IValidationFunctions<IPrcItemAssignmentEntity> {
		return {
			EstHeaderFk: this.validateEstHeaderFk,
			EstLineItemFk: this.validateEstLineItemFk,
			BoqItemFk: this.validateBoqItemFk,
			EstResourceFk: this.validateEstResourceFk,
			PrcItemFk: this.validatePrcItemFk,
		};
	}

	protected validateEstHeaderFk(info: ValidationInfo<IPrcItemAssignmentEntity>) {
		const result = this.validateAsChangeEntity(info.entity, info.value ? (info.value as number) : null, info.field);
		this.setFieldsReadonly(info);
		return result;
	}

	protected validateEstLineItemFk(info: ValidationInfo<IPrcItemAssignmentEntity>) {
		const result = this.validateAsChangeEntity(info.entity, info.value ? (info.value as number) : null, info.field);
		this.setFieldsReadonly(info);
		return result;
	}

	protected validateBoqItemFk(info: ValidationInfo<IPrcItemAssignmentEntity>) {
		const result = this.validateAsChangeEntity(info.entity, info.value ? (info.value as number) : null, info.field);
		this.setFieldsReadonly(info);
		return result;
	}

	protected validateEstResourceFk(info: ValidationInfo<IPrcItemAssignmentEntity>) {
		const result = this.validateAsChangeEntity(info.entity, info.value ? (info.value as number) : null, info.field);
		this.setFieldsReadonly(info);
		return result;
	}

	protected validatePrcItemFk(info: ValidationInfo<IPrcItemAssignmentEntity>) {
		const result = this.validateAsChangeEntity(info.entity, info.value ? (info.value as number) : null, info.field);
		this.setFieldsReadonly(info);
		return result;
	}

	private setFieldsReadonly(info: ValidationInfo<IPrcItemAssignmentEntity>) {
		// only for fields with number type
		const value = info.value ? (info.value as number) : null;
		set(info.entity, info.field, value);
		this.itemAssignmentService.readonlyProcessor.process(info.entity);
	}

	private onEstHeaderFkChanged(/* entity, value, model */) {}

	private onEstLineItemFkChanged(/* entity, value, model */) {}

	private onEstResourceFkChanged(/* entity, value, model */) {}

	private onPrcItemFkChanged(/* entity, value, model */) {}

	private onBoqItemFkChanged(entity: IPrcItemAssignmentEntity, value: number | undefined | null, model: string) {
		// todo chi: common service is not available
		// if (value) {
		// 	var boqItem = procurementPackageBoqLookupService.getItemById(value);
		// 	var rootItem = getBoqRootItem(boqItem);
		// 	if (rootItem && angular.isDefined(rootItem.Id)) {
		// 		entity.BoqHeaderFk = boqItem.BoqHeaderFk;
		// 		entity.BoqHeaderReference = rootItem.Reference;
		// 	}
		// }
		// else {
		// 	entity.BoqHeaderFk = null;
		// 	entity.BoqHeaderReference = null;
		// }
		//
		// // ////////////////////
		//
		// function getBoqRootItem(item) {
		// 	var rootItem = null;
		// 	if (item && angular.isDefined(item.Id)) {
		// 		var list = procurementPackageBoqLookupService.getList();
		// 		if (list && list.length > 0) {
		// 			var output = [];
		// 			cloudCommonGridService.flatten(list, output, 'BoqItems');
		// 			rootItem = cloudCommonGridService.getRootParentItem(item, output, 'BoqItemFk');
		// 		}
		// 	}
		// 	return rootItem && angular.isDefined(rootItem.Id) ? rootItem : null;
		// }
	}

	private getfieldStatuses(id: number) {
		if (!this.fieldStatusCache[id]) {
			this.fieldStatusCache[id] = {
				EstHeaderFk: this.status.valid,
				EstLineItemFk: this.status.valid,
				BoqItemFk: this.status.valid,
				EstResourceFk: this.status.valid,
				PrcItemFk: this.status.valid,
			};
		}

		return this.fieldStatusCache[id];
	}

	private validateAsChangeEntity(entity: IPrcItemAssignmentEntity, value: number | undefined | null, model: string) {
		this.outPutValidationStatus(entity, value, model);
		return this.applyValidationStatuses(entity, value, model);
	}

	public validateAfterDeleteEntities(entities: IPrcItemAssignmentEntity[]) {
		entities.forEach((entity) => {
			this.validateUnique(entity);
		});
	}

	private outPutValidationStatus(entity: IPrcItemAssignmentEntity, value: number | undefined | null, model: string) {
		const tempEntity = cloneDeep(entity);
		set(tempEntity, model, value);

		if (this.isNewCreated(entity, tempEntity)) {
			const fieldStatuses = this.getfieldStatuses(entity.Id);
			fieldStatuses.EstHeaderFk = this.status.errorEmptyOrNull;
			fieldStatuses.EstLineItemFk = this.status.errorEmptyOrNull;
			fieldStatuses.BoqItemFk = this.status.errorEmptyOrNull;
			fieldStatuses.EstResourceFk = this.status.errorEmptyOrNull;
			fieldStatuses.PrcItemFk = this.status.errorEmptyOrNull;
		} else {
			switch (model) {
				case 'EstHeaderFk':
					this.doValidateEstHeaderFk(entity, tempEntity);
					break;
				case 'EstLineItemFk':
					this.doValidateEstLineItemFk(entity, tempEntity);
					break;
				case 'BoqItemFk':
					this.doValidateBoqItemFk(entity, tempEntity);
					break;
				case 'EstResourceFk':
					this.doValidateEstResourceFk(entity, tempEntity);
					break;
				case 'PrcItemFk':
					this.doValidatePrcItemFk(entity, tempEntity);
					break;
				default:
					break;
			}
		}
	}

	private applyValidationStatuses(entity: IPrcItemAssignmentEntity, value: number | undefined | null, model: string) {
		let result = this.validationService.createSuccessObject();

		const tempEntity = cloneDeep(entity);
		set(tempEntity, model, value);

		switch (model) {
			case 'EstHeaderFk':
				result = this.applyValidationStatus(entity, tempEntity.EstHeaderFk, 'EstHeaderFk');
				this.applyValidationStatus(entity, tempEntity.EstLineItemFk, 'EstLineItemFk');
				this.applyValidationStatus(entity, tempEntity.EstResourceFk, 'EstResourceFk');
				break;
			case 'EstLineItemFk':
				result = this.applyValidationStatus(entity, tempEntity.EstLineItemFk, 'EstLineItemFk');
				this.applyValidationStatus(entity, tempEntity.EstResourceFk, 'EstResourceFk');
				break;
			case 'BoqItemFk':
				result = this.applyValidationStatus(entity, tempEntity.BoqItemFk, 'BoqItemFk');
				this.applyValidationStatus(entity, tempEntity.EstResourceFk, 'EstResourceFk');
				this.applyValidationStatus(entity, tempEntity.PrcItemFk, 'PrcItemFk');
				break;
			case 'EstResourceFk':
				this.applyValidationStatus(entity, tempEntity.BoqItemFk, 'BoqItemFk');
				result = this.applyValidationStatus(entity, tempEntity.EstResourceFk, 'EstResourceFk');
				this.applyValidationStatus(entity, tempEntity.PrcItemFk, 'PrcItemFk');
				break;
			case 'PrcItemFk':
				this.applyValidationStatus(entity, tempEntity.BoqItemFk, 'BoqItemFk');
				this.applyValidationStatus(entity, tempEntity.EstResourceFk, 'EstResourceFk');
				result = this.applyValidationStatus(entity, tempEntity.PrcItemFk, 'PrcItemFk');
				break;
			default:
				break;
		}

		return result;
	}

	private getFieldName(model: string) {
		switch (model) {
			case 'EstHeaderFk': {
				return this.translationService.instant(MODULE_INFO_PROCUREMENT.EstimateMainModuleName + '.estHeaderFk').text;
			}
			case 'EstLineItemFk': {
				return this.translationService.instant(MODULE_INFO_PROCUREMENT.EstimateMainModuleName + '.estLineItemFk').text;
			}
			case 'EstResourceFk': {
				return this.translationService.instant(MODULE_INFO_PROCUREMENT.EstimateMainModuleName + '.estResourceFk').text;
			}
			case 'BoqItemFk': {
				return this.translationService.instant(MODULE_INFO_PROCUREMENT.EstimateMainModuleName + '.boqItemFk').text;
			}
			case 'PrcItemFk': {
				return this.translationService.instant(MODULE_INFO_PROCUREMENT.ProcurementCommonModuleName + '.prcItemMaterial').text;
			}
			default: {
				return model;
			}
		}
	}

	private applyValidationStatus(entity: IPrcItemAssignmentEntity, value: number | undefined | null, model: string) {
		const result = this.validationService.createSuccessObject();

		const fieldStatuses = this.getfieldStatuses(entity.Id);
		const filedStatus = get(fieldStatuses, model);
		if (filedStatus === this.status.valid) {
			result.valid = true;
		} else {
			result.valid = false;
			let error = '...';
			const errorParam = { fieldName: this.getFieldName(model) };

			switch (filedStatus) {
				case this.status.errorEmptyOrNull:
					error = 'cloud.common.emptyOrNullValueErrorMessage';
					break;
				case this.status.errorEstResourceWithBoQ:
					error = 'procurement.package.itemAssignment.error.estResourceWithBoQ';
					break;
				case this.status.errorBoqNotPosition:
					error = 'procurement.package.itemAssignment.error.BoQNotPosition';
					break;
				case this.status.errorDifferentMaterialFk:
					error = 'procurement.package.itemAssignment.error.differentMaterialFk';
					break;
				case this.status.errorDifferentMaterialDescription:
					error = 'procurement.package.itemAssignment.error.differentMaterialDescription';
					break;
				case this.status.errorIsNotUnique:
					error = 'procurement.package.itemAssignment.error.notUnique';
					break;
				default:
					break;
			}

			result.error = this.translationService.instant(error, errorParam).text;
		}

		this.applyValidationResult(result, entity, model);
		return result;
	}

	private applyValidationResult(result: ValidationResult, entity: IPrcItemAssignmentEntity, model: string) {
		if (result.valid) {
			this.itemAssignmentService.removeInvalid(entity, {
				field: model,
				result: result,
			});
		} else {
			this.itemAssignmentService.addInvalid(entity, {
				field: model,
				result: result,
			});
		}
	}

	private isNewCreated(entity: IPrcItemAssignmentEntity, tempEntity: IPrcItemAssignmentEntity) {
		return this.isAllNull(entity) && this.isAllNull(tempEntity);
	}

	private doValidateEstHeaderFk(entity: IPrcItemAssignmentEntity, tempEntity: IPrcItemAssignmentEntity) {
		if (entity.EstHeaderFk === tempEntity.EstHeaderFk) {
			return;
		}

		this.onEstHeaderFkChanged(/* entity, tempEntity.EstHeaderFk, 'EstHeaderFk' */);

		const fieldStatuses = this.getfieldStatuses(entity.Id);
		fieldStatuses.EstHeaderFk = this.status.valid;
		if (!this.mandatoryCheck(tempEntity.EstHeaderFk)) {
			fieldStatuses.EstHeaderFk = this.status.errorEmptyOrNull;
		}

		this.resetEstLineItemFk(tempEntity);
		if (entity.EstLineItemFk !== tempEntity.EstLineItemFk) {
			this.doValidateEstLineItemFk(entity, tempEntity);
			entity.EstLineItemFk = tempEntity.EstLineItemFk;
		}

		this.isUnique(entity, tempEntity.EstHeaderFk, 'EstHeaderFk');
	}

	private doValidateEstLineItemFk(entity: IPrcItemAssignmentEntity, tempEntity: IPrcItemAssignmentEntity) {
		if (entity.EstLineItemFk === tempEntity.EstLineItemFk) {
			return;
		}

		this.onEstLineItemFkChanged(/* entity, tempEntity.EstLineItemFk, 'EstLineItemFk' */);

		const fieldStatuses = this.getfieldStatuses(entity.Id);
		fieldStatuses.EstLineItemFk = this.status.valid;
		if (!this.mandatoryCheck(tempEntity.EstLineItemFk)) {
			fieldStatuses.EstLineItemFk = this.status.errorEmptyOrNull;
		}

		this.resetEstResourceFk(tempEntity);
		if (entity.EstResourceFk !== tempEntity.EstResourceFk) {
			this.doValidateEstResourceFk(entity, tempEntity);
			entity.EstResourceFk = tempEntity.EstResourceFk;
		}

		this.isUnique(entity, tempEntity.EstLineItemFk, 'EstLineItemFk');
	}

	private doValidateEstResourceFk(entity: IPrcItemAssignmentEntity, tempEntity: IPrcItemAssignmentEntity) {
		if (entity.EstResourceFk === tempEntity.EstResourceFk) {
			return;
		}

		this.onEstResourceFkChanged(/* entity, tempEntity.EstResourceFk, 'EstResourceFk' */);

		const fieldStatuses = this.getfieldStatuses(entity.Id);
		fieldStatuses.EstResourceFk = this.status.valid;
		if (!this.mandatoryCheck(tempEntity.EstResourceFk)) {
			fieldStatuses.EstResourceFk = this.status.errorEmptyOrNull;

			if (fieldStatuses.BoqItemFk === this.status.errorEstResourceWithBoQ) {
				fieldStatuses.BoqItemFk = this.status.valid;
			}
		}

		this.isEstResourceWithBoQ(tempEntity);
		this.isMaterialDifferent(tempEntity);
		this.isUnique(entity, tempEntity.EstResourceFk, 'EstResourceFk');
	}

	private doValidatePrcItemFk(entity: IPrcItemAssignmentEntity, tempEntity: IPrcItemAssignmentEntity) {
		if (entity.PrcItemFk === tempEntity.PrcItemFk) {
			return;
		}

		this.onPrcItemFkChanged(/* entity, tempEntity.PrcItemFk, 'PrcItemFk' */);

		const fieldStatuses = this.getfieldStatuses(entity.Id);
		fieldStatuses.PrcItemFk = this.status.valid;
		if (!this.mandatoryCheck(tempEntity.PrcItemFk)) {
			fieldStatuses.PrcItemFk = this.status.errorEmptyOrNull;

			if (!this.mandatoryCheck(tempEntity.BoqItemFk)) {
				fieldStatuses.BoqItemFk = this.status.errorEmptyOrNull;
			}
		} else {
			fieldStatuses.BoqItemFk = this.status.valid;
		}

		this.isMaterialDifferent(tempEntity);
		this.isUnique(entity, tempEntity.PrcItemFk, 'PrcItemFk');
	}

	private doValidateBoqItemFk(entity: IPrcItemAssignmentEntity, tempEntity: IPrcItemAssignmentEntity) {
		if (entity.BoqItemFk === tempEntity.BoqItemFk) {
			return;
		}

		this.onBoqItemFkChanged(entity, tempEntity.BoqItemFk, 'BoqItemFk');

		const fieldStatuses = this.getfieldStatuses(entity.Id);
		fieldStatuses.BoqItemFk = this.status.valid;
		if (!this.mandatoryCheck(tempEntity.BoqItemFk)) {
			fieldStatuses.BoqItemFk = this.status.errorEmptyOrNull;

			if (!this.mandatoryCheck(tempEntity.PrcItemFk)) {
				fieldStatuses.PrcItemFk = this.status.errorEmptyOrNull;
			}
			if (fieldStatuses.EstResourceFk === this.status.errorEstResourceWithBoQ) {
				fieldStatuses.EstResourceFk = this.status.valid;
			}
		} else {
			fieldStatuses.PrcItemFk = this.status.valid;
		}

		this.isEstResourceWithBoQ(tempEntity);

		if (fieldStatuses.BoqItemFk === this.status.valid) {
			this.isBoQNotPosition(tempEntity);
		}

		this.isUnique(entity, tempEntity.BoqItemFk, 'BoqItemFk');
	}

	private isEstResourceWithBoQ(tempEntity: IPrcItemAssignmentEntity) {
		const list = this.itemAssignmentService.getList();
		const found = list.find((item) => {
			return item.Id !== tempEntity.Id && item.EstResourceFk === tempEntity.EstResourceFk && item.BoqItemFk && tempEntity.BoqItemFk;
		});

		if (found) {
			const fieldStatuses = this.getfieldStatuses(tempEntity.Id);
			fieldStatuses.BoqItemFk = this.status.errorEstResourceWithBoQ;
			fieldStatuses.EstResourceFk = this.status.errorEstResourceWithBoQ;
		}
	}

	private isBoQNotPosition(tempEntity: IPrcItemAssignmentEntity) {
		// todo chi: common service is not available
		// const boqItem = procurementPackageBoqLookupService.getItemById(tempEntity.BoqItemFk);
		// if (boqItem && boqItem.Id && boqItem.BoqLineTypeFk !== 0) {
		// 	const fieldStatuses = this.getfieldStatuses(tempEntity.Id);
		// 	fieldStatuses.BoqItemFk = this.status.errorBoqNotPosition;
		// }
	}

	private isMaterialDifferent(tempEntity: IPrcItemAssignmentEntity) {
		// todo chi: common logic is not available
		// const prcItems = basicsLookupdataLookupDescriptorService.getData('prcitem');
		// const prcItemId = tempEntity.PrcItemFk;
		// const prcItem = prcItemId !== null && prcItemId !== -1 ? prcItems[prcItemId] : null;
		//
		// const resources = basicsLookupdataLookupDescriptorService.getData('estresource4itemassignment');
		// const resourceId = tempEntity.EstResourceFk;
		// const resource = resourceId !== null && resourceId !== -1 ? resources[resourceId] : null;
		//
		// const fieldStatuses = this.getfieldStatuses(tempEntity.Id);
		// if(prcItem && resource){
		// 	if(resource.EstResourceTypeFk === 2) {
		// 		if (prcItem.MdcMaterialFk !== resource.MdcMaterialFk&&prcItem.BasUomFk!==resource.BasUomFk) {
		// 			fieldStatuses.EstResourceFk = this.status.errorDifferentMaterialFk;
		// 			fieldStatuses.PrcItemFk = this.status.errorDifferentMaterialFk;
		// 		}
		// 		else{
		// 			if(this.isMaterialDifferentStatus(fieldStatuses)){
		// 				fieldStatuses.EstResourceFk = this.status.valid;
		// 				fieldStatuses.PrcItemFk = this.status.valid;
		// 			}
		// 		}
		// 	}
		// 	else {
		// 		if(prcItem.MaterialDescription !== resource.DescriptionInfo.Translated&&prcItem.BasUomFk!==resource.BasUomFk){
		// 			fieldStatuses.EstResourceFk = this.status.errorDifferentMaterialDescription;
		// 			fieldStatuses.PrcItemFk = this.status.errorDifferentMaterialDescription;
		// 		}
		// 		else{
		// 			if(this.isMaterialDifferentStatus(fieldStatuses)){
		// 				fieldStatuses.EstResourceFk = this.status.valid;
		// 				fieldStatuses.PrcItemFk = this.status.valid;
		// 			}
		// 		}
		// 	}
		// }
		// else{
		// 	if(this.isMaterialDifferentStatus(fieldStatuses)){
		// 		if(resource){
		// 			fieldStatuses.EstResourceFk = this.status.valid;
		// 		}
		//
		// 		if(prcItem){
		// 			fieldStatuses.PrcItemFk = this.status.valid;
		// 		}
		// 	}
		// }
	}

	private isMaterialDifferentStatus(fieldStatuses: IFieldStatus) {
		return (
			fieldStatuses.EstResourceFk === this.status.errorDifferentMaterialFk ||
			fieldStatuses.EstResourceFk === this.status.errorDifferentMaterialDescription ||
			fieldStatuses.PrcItemFk === this.status.errorDifferentMaterialFk ||
			fieldStatuses.PrcItemFk === this.status.errorDifferentMaterialDescription
		);
	}

	private mandatoryCheck(value: number | undefined | null) {
		let valid = true;
		if (value === -1 || value === 0 || value === null || value === undefined) {
			valid = false;
		}
		return valid;
	}

	private resetEstLineItemFk(tempEntity: IPrcItemAssignmentEntity) {
		tempEntity.EstLineItemFk = -1;
	}

	private resetEstResourceFk(tempEntity: IPrcItemAssignmentEntity) {
		tempEntity.EstResourceFk = -1;
	}

	private isAllNull(entity: IPrcItemAssignmentEntity) {
		return !(this.mandatoryCheck(entity.EstHeaderFk) || this.mandatoryCheck(entity.EstLineItemFk) || this.mandatoryCheck(entity.BoqItemFk) || this.mandatoryCheck(entity.EstResourceFk) || this.mandatoryCheck(entity.PrcItemFk));
	}

	private isUnique(entity: IPrcItemAssignmentEntity, value: number | undefined | null, model: string) {
		const fieldStatuses = this.getfieldStatuses(entity.Id);
		if (
			fieldStatuses.EstHeaderFk !== this.status.valid ||
			fieldStatuses.EstLineItemFk !== this.status.valid ||
			fieldStatuses.BoqItemFk !== this.status.valid ||
			fieldStatuses.EstResourceFk !== this.status.valid ||
			fieldStatuses.PrcItemFk !== this.status.valid
		) {
			this.restoreFromIsNotUniqueStatus(entity, value, model);
			return;
		}

		this.validateUnique(entity, value, model);
	}

	private restoreFromIsNotUniqueStatus(entity: IPrcItemAssignmentEntity, value: number | undefined | null, model: string) {
		const fieldStatuses = this.getfieldStatuses(entity.Id);
		if (
			fieldStatuses.EstHeaderFk === this.status.errorIsNotUnique ||
			fieldStatuses.EstLineItemFk === this.status.errorIsNotUnique ||
			fieldStatuses.BoqItemFk === this.status.errorIsNotUnique ||
			fieldStatuses.EstResourceFk === this.status.errorIsNotUnique ||
			fieldStatuses.PrcItemFk === this.status.errorIsNotUnique
		) {
			this.validateUnique(entity, value, model);
		}
	}

	// validate unique
	private validateUnique(entity: IPrcItemAssignmentEntity, value?: number | null, model?: string) {
		if (model === undefined) {
			this.validateInDuplicateEntities(entity);
		} else {
			const isDuplicate = this.validateInDuplicateEntities(entity, value, model);
			if (!isDuplicate) {
				this.validateInAllEntities(entity, value, model);
			}
		}
	}

	private validateInDuplicateEntities(entity: IPrcItemAssignmentEntity, value?: number | null, model?: string) {
		let isDuplicate = false;
		const duplicateEntities: IPrcItemAssignmentEntity[] = [];

		for (let i = 0; i < this.duplicateEntityIdContainer.length; ++i) {
			const duplicateEntityIds = this.duplicateEntityIdContainer[i];

			const index = duplicateEntityIds.indexOf(entity.Id);
			if (index !== -1) {
				if (duplicateEntityIds.length > 2) {
					duplicateEntityIds.splice(index, 1);
				} else {
					duplicateEntityIds.splice(index, 1);
					for (let j = 0; j < duplicateEntityIds.length; ++j) {
						const duplicateEntityId = duplicateEntityIds[j];
						const containerData = this.getContainerData(duplicateEntityId);
						if (containerData) {
							duplicateEntities.push(containerData);
						}
					}
					this.duplicateEntityIdContainer.splice(i, 1);
				}

				const previousStatuses = this.getPreviousStatus(entity.Id);
				this.applyUniqueValidationStatuses(duplicateEntities, false, entity, previousStatuses);
			} else {
				const _duplicateEntityId = duplicateEntityIds[0];
				const duplicateEntity = this.getContainerData(_duplicateEntityId);
				if (model) {
					set(entity, model, value);
				}

				if (duplicateEntity && this.isEntitiesDuplicate(duplicateEntity, entity)) {
					duplicateEntityIds.push(entity.Id);
					duplicateEntities.push(entity);
					this.applyUniqueValidationStatuses(duplicateEntities, true);
					isDuplicate = true;
					break;
				}
			}
		}

		return isDuplicate;
	}

	private validateInAllEntities(entity: IPrcItemAssignmentEntity, value: number | undefined | null, model: string) {
		const duplicateIds: number[] = [];
		const duplicateEntities: IPrcItemAssignmentEntity[] = [];
		const containerDatas = this.itemAssignmentService.getList();

		containerDatas.forEach((item) => {
			if (item.Id !== entity.Id) {
				set(entity, model, value);
				if (this.isEntitiesDuplicate(item, entity)) {
					duplicateIds.push(item.Id);
					duplicateEntities.push(item);

					if (duplicateIds.indexOf(entity.Id) === -1) {
						duplicateIds.push(entity.Id);
						duplicateEntities.push(entity);
					}
				}
			}
		});

		if (duplicateIds.length > 0) {
			this.duplicateEntityIdContainer.push(duplicateIds);
			this.applyUniqueValidationStatuses(duplicateEntities, true);
		}
	}

	private applyUniqueValidationStatuses(entities: IPrcItemAssignmentEntity[], isDuplicate: boolean, entity?: IPrcItemAssignmentEntity, previousStatuses?: IFieldStatus) {
		for (let i = 0; i < entities.length; ++i) {
			const fieldStatuses = this.getfieldStatuses(entities[i].Id);
			if (isDuplicate) {
				this.copyStatues(null, fieldStatuses, this.status.errorIsNotUnique);
			} else {
				this.copyStatues(null, fieldStatuses, this.status.valid);
			}
		}

		entities.forEach((item) => {
			this.applyValidationStatus(item, item.EstHeaderFk, 'EstHeaderFk');
			this.applyValidationStatus(item, item.EstLineItemFk, 'EstLineItemFk');
			this.applyValidationStatus(item, item.EstResourceFk, 'EstResourceFk');
			this.applyValidationStatus(item, item.BoqItemFk, 'BoqItemFk');
			this.applyValidationStatus(item, item.PrcItemFk, 'PrcItemFk');
		});

		if (!isDuplicate && entity) {
			const _fieldStatuses = this.getfieldStatuses(entity.Id);
			this.copyStatues(previousStatuses, _fieldStatuses, this.status.valid);

			this.applyValidationStatus(entity, entity.EstHeaderFk, 'EstHeaderFk');
			this.applyValidationStatus(entity, entity.EstLineItemFk, 'EstLineItemFk');
			this.applyValidationStatus(entity, entity.EstResourceFk, 'EstResourceFk');
			this.applyValidationStatus(entity, entity.BoqItemFk, 'BoqItemFk');
			this.applyValidationStatus(entity, entity.PrcItemFk, 'PrcItemFk');
		}
	}

	private getContainerData(Id: number) {
		const containerDatas = this.itemAssignmentService.getList();
		for (let i = 0; i < containerDatas.length; ++i) {
			if (containerDatas[i].Id === Id) {
				return containerDatas[i];
			}
		}

		return null;
	}

	private isEntitiesDuplicate(entity1: IPrcItemAssignmentEntity, entity2: IPrcItemAssignmentEntity) {
		if (!entity1 || !entity2) {
			return false;
		}

		// const fieldStatuses = getfieldStatuses(entity1.Id);
		return !(
			!this.isPossibleToDuplicate(entity1, entity2, 'EstHeaderFk') ||
			!this.isPossibleToDuplicate(entity1, entity2, 'EstLineItemFk') ||
			!this.isPossibleToDuplicate(entity1, entity2, 'BoqItemFk') ||
			!this.isPossibleToDuplicate(entity1, entity2, 'EstResourceFk') ||
			!this.isPossibleToDuplicate(entity1, entity2, 'PrcItemFk')
		);
	}

	private isPossibleToDuplicate(entity1: IPrcItemAssignmentEntity, entity2: IPrcItemAssignmentEntity, model: string) {
		let isPossible = true;
		const fieldStatuses = this.getfieldStatuses(entity1.Id);
		const entityFieldValue1 = get(entity1, model);
		const entityFieldValue2 = get(entity2, model);
		const fieldStatus = get(fieldStatuses, model);
		if (entityFieldValue1 !== entityFieldValue2 || (fieldStatus !== this.status.valid && fieldStatus !== this.status.errorIsNotUnique)) {
			isPossible = false;
		}
		return isPossible;
	}

	private copyStatues(src: IFieldStatus | null | undefined, dst: IFieldStatus | null, defaultStatus: string) {
		const tempDst: IFieldStatus = {
			EstHeaderFk: src && src.EstHeaderFk ? src.EstHeaderFk : defaultStatus,
			EstLineItemFk: src && src.EstLineItemFk ? src.EstLineItemFk : defaultStatus,
			BoqItemFk: src && src.BoqItemFk ? src.BoqItemFk : defaultStatus,
			EstResourceFk: src && src.EstResourceFk ? src.EstResourceFk : defaultStatus,
			PrcItemFk: src && src.PrcItemFk ? src.PrcItemFk : defaultStatus,
		};

		return merge(dst, tempDst);
	}

	private getPreviousStatus(id: number) {
		const fieldStatuses = this.getfieldStatuses(id);
		const previousStatuses = this.copyStatues(fieldStatuses, null, this.status.valid);

		if (previousStatuses.EstHeaderFk === this.status.errorIsNotUnique) {
			previousStatuses.EstHeaderFk = this.status.valid;
		}
		if (previousStatuses.EstLineItemFk === this.status.errorIsNotUnique) {
			previousStatuses.EstLineItemFk = this.status.valid;
		}
		if (previousStatuses.EstResourceFk === this.status.errorIsNotUnique) {
			previousStatuses.EstResourceFk = this.status.valid;
		}
		if (previousStatuses.BoqItemFk === this.status.errorIsNotUnique) {
			previousStatuses.BoqItemFk = this.status.valid;
		}
		if (previousStatuses.PrcItemFk === this.status.errorIsNotUnique) {
			previousStatuses.PrcItemFk = this.status.valid;
		}

		return previousStatuses;
	}
}