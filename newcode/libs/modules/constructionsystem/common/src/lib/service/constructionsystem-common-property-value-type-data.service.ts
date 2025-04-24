import { inject, Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { find, result } from 'lodash';

@Injectable({
	providedIn: 'root',
})
export class ConstructionsystemCommonPropertyValueTypeDataService {
	private readonly translateService = inject(PlatformTranslateService);

	private readonly valueTypes = [
		{
			code: 'string',
			value: 1,
			description: this.translateService.instant('constructionsystem.common.filterEditor.stringDescription'),
		},
		{
			code: 'decimal',
			value: 2,
			description: this.translateService.instant('constructionsystem.common.filterEditor.decimalDescription'),
		},
		{
			code: 'integer',
			value: 3,
			description: this.translateService.instant('constructionsystem.common.filterEditor.integerDescription'),
		},
		{
			code: 'boolean',
			value: 4,
			description: this.translateService.instant('constructionsystem.common.filterEditor.booleanDescription'),
		},
		{
			code: 'dateTime',
			value: 5,
			description: this.translateService.instant('constructionsystem.common.filterEditor.dateTimeDescription'),
		},
	];

	public getList() {
		return this.valueTypes;
	}

	public getListSync() {
		return this.valueTypes;
	}

	public async getListAsync() {
		return Promise.resolve(this.valueTypes);
	}

	public getItemById(id: number) {
		return find(this.valueTypes, { value: id });
	}

	public getItemByKey(key: number) {
		return find(this.valueTypes, { value: key });
	}

	public getItemByIdAsync(id: number) {
		return Promise.resolve(find(this.valueTypes, { value: id }));
	}

	public getValueTypeDescription(valueType: string): string {
		return result(find(this.valueTypes, { value: valueType }), 'description') || '';
	}
}