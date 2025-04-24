/*
 * Copyright(c) RIB Software GmbH
 */

import { cloneDeep } from 'lodash';
import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ICosGroupEntity } from '../../model/models';
import { ConstructionSystemMasterGroupDataService } from '../construction-system-master-group-data.service';

interface ICosGroupValidateResponse {
	ErrorCode?: string;
	ValidateResult: boolean;
}

interface ICosGroupValidateDto {
	Id: number;
	Code?: string | null;
	CosGroupFk?: number | null;
	GroupChildren?: ICosGroupValidateDto[];
}

enum ErrorCode {
	NullError = '1001',
	UniquenessError = '1002',
}

/**
 * Construction system master group validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterGroupValidationService extends BaseValidationService<ICosGroupEntity> {
	private readonly http = inject(PlatformHttpService);
	private readonly dataService = inject(ConstructionSystemMasterGroupDataService);
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<ICosGroupEntity> {
		return {
			Code: this.validateCode,
			Sorting: this.validateSorting,
			IsChecked: this.validateIsChecked,
			IsDefault: this.validateIsDefault,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosGroupEntity> {
		return this.dataService;
	}

	private async validateCode(info: ValidationInfo<ICosGroupEntity>) {
		const items = this.dataService.flatList();
		let root: ICosGroupValidateDto = {
			Id: info.entity.Id,
			Code: info.value as string,
			CosGroupFk: info.entity.CosGroupFk,
		};
		let parent: ICosGroupEntity | undefined = info.entity;
		while (parent && parent.CosGroupFk) {
			parent = items.find((item) => item.Id === parent?.CosGroupFk);
			if (parent) {
				root = {
					Id: parent.Id,
					Code: parent.Code,
					CosGroupFk: parent.CosGroupFk,
					GroupChildren: [root],
				};
			}
		}

		const postData = {
			ValidateDto: root,
			Value: info.entity.Id,
			Model: info.field,
		};

		const result = await this.http.post<ICosGroupValidateResponse>('constructionsystem/master/group/validate', postData);
		if (!result.ValidateResult) {
			let errorKey = '';
			if (result.ErrorCode === ErrorCode.NullError) {
				errorKey = 'cloud.common.emptyOrNullValueErrorMessage';
			} else if (result.ErrorCode === ErrorCode.UniquenessError) {
				errorKey = 'constructionsystem.master.uniqueInSameGroupRoot';
			}
			return this.validationUtils.createErrorObject({ key: errorKey, params: { fieldName: 'Code' } });
		}
		return this.validationUtils.createSuccessObject();
	}

	private validateSorting(info: ValidationInfo<ICosGroupEntity>) {
		if (info.value === null || info.value === '') {
			return this.validationUtils.createErrorObject({ key: 'cloud.common.emptyOrNullValueErrorMessage' });
		}
		return this.validationUtils.createSuccessObject();
	}

	private validateIsChecked(info: ValidationInfo<ICosGroupEntity>) {
		// todo-allen: update it after the validate function and SelectionMode button available.
		this.dataService.fireGroupCheckedChanged(info.entity, info.value as boolean);
		return new ValidationResult();
	}

	private async validateIsDefault(info: ValidationInfo<ICosGroupEntity>) {
		const result = new ValidationResult();

		if (info.entity.Version === 0) {
			return result;
		}

		const flatList = this.dataService.flatList();

		const otherDefaultItems = [];
		for (const item of flatList) {
			if (item.IsDefault && item.Id !== info.entity.Id) {
				otherDefaultItems.push(item);
			}
		}
		if (info.value) {
			for (const item of otherDefaultItems) {
				item.IsDefault = false;
				this.dataService.entitiesUpdated(item);
			}

			info.entity.IsDefault = info.value as boolean;
			const groupChildren = cloneDeep(info.entity.GroupChildren);
			const updatedEntity = await this.dataService.update(info.entity);
			if (groupChildren) {
				updatedEntity.HasChildren = true;
				updatedEntity.GroupChildren = groupChildren;
				this.dataService.entitiesUpdated(updatedEntity);
			}
		} else {
			if (otherDefaultItems.length === 0) {
				setTimeout(() => {
					info.entity.IsDefault = true;
					this.dataService.entitiesUpdated(info.entity);
				}, );
			}
		}
		this.dataService.clearModifications();

		return result;
	}
}
