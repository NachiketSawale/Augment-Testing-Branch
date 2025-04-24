/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformTranslateService, Translatable } from '@libs/platform/common';

/**
 * Aggregate Type Service
 */
@Injectable({
	providedIn: 'root',
})
export class AggregateTypeService {
	private readonly translateService = inject(PlatformTranslateService);

	private readonly aggregateTypeList = [
		'constructionsystem.master.entityAggregateNoneType',
		'constructionsystem.master.entityAggregateSumType',
		'constructionsystem.master.entityAggregateMinType',
		'constructionsystem.master.entityAggregateMaxType',
		'constructionsystem.master.entityAggregateAverageType',
	];

	private _aggregateTypeListTranslated?: { Id: number; Description: Translatable }[];

	private get aggregateTypeListTranslated() {
		if (!this._aggregateTypeListTranslated) {
			this._aggregateTypeListTranslated = this.aggregateTypeList.map((item, index) => ({
				Id: index,
				Description: this.translateService.instant(item).text,
			}));
		}
		return this._aggregateTypeListTranslated;
	}

	public getByIndex(index: number) {
		return this.aggregateTypeListTranslated[index]?.Description || this.aggregateTypeListTranslated[0]?.Description || '';
	}

	public getList() {
		return this.aggregateTypeListTranslated;
	}
}
