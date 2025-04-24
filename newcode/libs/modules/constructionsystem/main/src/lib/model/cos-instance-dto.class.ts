/*
 * Copyright(c) RIB Software GmbH
 */
import { get } from 'lodash';
import { IBasicsCustomizeSystemOptionEntity } from '@libs/basics/interfaces';
import { IFilterResult } from '@libs/platform/common';
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';
import { CostGroupCompleteEntity, IBasicMainItem2CostGroup } from '@libs/basics/shared';
import { InstanceHeaderProjectInfo } from './entities/Instance-header-project-info.interface';

/**
 * construction system instance response dto
 */
export class CosInstanceDto {
	public constructor(public data: unknown) {}

	public get SystemOptions() {
		return this.getValueAs<IBasicsCustomizeSystemOptionEntity[]>('SystemOptions', []);
	}

	public get FilterResult() {
		return this.getValueAs<IFilterResult>('FilterResult', undefined);
	}

	public get IsFavoritesJump() {
		return this.getValueAs<boolean>('IsFavoritesJump', false);
	}

	public get dtos() {
		return this.getValueAs<ICosInstanceEntity[]>('dtos', []);
	}

	public get Header2CostGroups() {
		return this.getValueAs<IBasicMainItem2CostGroup[]>('Header2CostGroups', []);
	}

	public get CostGroupCompleteEntity() {
		return this.getValueAs<CostGroupCompleteEntity>('CostGroupCats', undefined);
	}

	/// todo waiting for CosTemplateEntity
	// public get CosTemplate() {
	// 	return this.getValueAs<CosTemplateEntity[]>('CosTemplate', [])!;
	// }

	public get InstanceHeaderProjectInfoDto() {
		return this.getValueAs<InstanceHeaderProjectInfo>('InstanceHeaderProjectInfoDto', undefined)!;
	}

	public getValueAs<TValue>(field: string, defaultValue?: TValue) {
		const value = get(this.data, field);

		if (value) {
			return value as TValue;
		}

		return defaultValue;
	}
}
