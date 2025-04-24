/*
 * Copyright(c) RIB Software GmbH
 */

import { get, set, filter } from 'lodash';
import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformHttpService, PropertyType } from '@libs/platform/common';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { ConstructionSystemMasterHeaderDataService } from '../construction-system-master-header-data.service';
import { ICosGroupEntity, ICosHeaderEntity } from '@libs/constructionsystem/shared';

/**
 * Construction system master validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterHeaderValidationService extends BaseValidationService<ICosHeaderEntity> {
	private readonly http = inject(PlatformHttpService);
	private readonly dataService = inject(ConstructionSystemMasterHeaderDataService);
	private readonly masterGroupService = undefined; // todo: constructionSystemMasterHeaderService is not implemented.
	private readonly validationUtils = inject(BasicsSharedDataValidationService);

	protected generateValidationFunctions(): IValidationFunctions<ICosHeaderEntity> {
		return {
			Code: [this.validateCode, this.asyncValidateCode],
			BasFormFk: this.validateBasFormFk,
			CosGroupFk: this.asyncValidateCosGroupFk,
			DescriptionInfoForBulkConfig: this.validateDescriptionInfoForBulkConfig,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICosHeaderEntity> {
		return this.dataService;
	}

	private getRootGroupId(item: ICosHeaderEntity) {
		return get(item, 'rootGroupId');
	}

	private setRootGroupId(item: ICosHeaderEntity, value: number) {
		set(item, 'rootGroupId', value);
	}

	private findRootGroupId(groupEntity: ICosGroupEntity, groupList: ICosGroupEntity[]): number {
		if (!groupEntity.CosGroupFk) {
			return groupEntity.Id;
		}
		const parentEntity = groupList.find((item) => item.Id === groupEntity.CosGroupFk);
		return parentEntity ? this.findRootGroupId(parentEntity, groupList) : groupEntity.Id;
	}

	private validationFk(value: PropertyType | undefined) {
		return value === undefined || value === null || value === '' || value === -1 || value === 0;
	}

	public validateCode(info: ValidationInfo<ICosHeaderEntity>) {
		if (this.validationFk(info.value)) {
			return this.validationUtils.createErrorObject({ key: 'cloud.common.emptyOrNullValueErrorMessage', params: { fieldName: info.field } });
		} else {
			// check the selected list, mainly for the Multi selected,can not set same code for Multi entity
			const selectedEntities = this.dataService.getSelection();
			if (selectedEntities !== null && selectedEntities.length > 0) {
				// const groupList: ICosGroupEntity[] = this.masterGroupService.getList(); // todo: constructionSystemMasterHeaderService is not implemented.
				const groupList: ICosGroupEntity[] = [];
				// get root group id
				for (const item of selectedEntities) {
					if (!this.getRootGroupId(item)) {
						const groupEntity = groupList.find((group) => group.Id === item.CosGroupFk); // todo: id or Id
						if (groupEntity !== undefined) {
							this.setRootGroupId(item, this.findRootGroupId(groupEntity, groupList));
						}
					}
				}

				const items = filter(selectedEntities, (item) => {
					return info.value === item.Code && item.Id !== info.entity.Id && this.getRootGroupId(item) === this.getRootGroupId(info.entity);
				});
				if (items.length && items.length > 0) {
					return this.validationUtils.createErrorObject({ key: 'cloud.common.uniqueValueErrorMessage', params: { fieldName: info.field } });
				}
			}
		}
		info.entity.Code = info.value?info.value.toString():'';
		return this.validationUtils.createSuccessObject();
	}

	private async asyncValidateCode(info: ValidationInfo<ICosHeaderEntity>): Promise<ValidationResult> {
		const response = await this.http.post<object>('constructionsystem/master/header/validate', { ValidateDto: info.entity, Value: info.value, Model: info.field });
		if (!response) {
			return this.validationUtils.createErrorObject({ key: 'constructionsystem.master.uniqueInSameGroupRoot' });
		}
		return this.validationUtils.createSuccessObject();
	}

	private asyncValidateCosGroupFk(info: ValidationInfo<ICosHeaderEntity>) {
		info.entity.CosGroupFk = info.value as number;
		return this.asyncValidateCode(info);
	}

	private validateBasFormFk(info: ValidationInfo<ICosHeaderEntity>) {
		info.entity.BasFormFk = info.value as number;
		this.dataService.headerValidateComplete.next(true);
		return this.validationUtils.createSuccessObject();
	}

	private validateDescriptionInfoForBulkConfig(info: ValidationInfo<ICosHeaderEntity>) {
		if (info.value && Array.isArray(info.value) && info.value.length > 255) {
			return this.validationUtils.createErrorObject({ key: 'cloud.common.lengthShouldBeLessThen', params: { length: 255 } });
		}
		return this.validationUtils.createSuccessObject();
	}
}
