/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { ILookupConfig, UiCommonLookupItemsDataService } from '@libs/ui/common';

export interface IWorkflowSortOptions {
	id: number;
	value: string;
	desc: boolean;
	property?: string;
	displayMember: string
}

@Injectable({
	providedIn: 'root'
})
export class WorkflowSortOptionsSettingsService<TEntity extends object> extends UiCommonLookupItemsDataService<IWorkflowSortOptions, TEntity> {

	public constructor(private translate: PlatformTranslateService) {
		let items: IWorkflowSortOptions[] = [
			{
				id: 1,
				desc: false,
				value: 'NoSorting',
				property: '',
				displayMember: 'cloud.desktop.taskList.sorting.noSorting'
			},
			{
				id: 2,
				desc: false,
				value: 'DescriptionAsc',
				property: 'Description',
				displayMember: 'cloud.desktop.taskList.sorting.status.asc'

			},
			{
				id: 3,
				desc: true,
				value: 'DescriptionDesc',
				property: 'Description',
				displayMember: 'cloud.desktop.taskList.sorting.status.desc'
			}
		];

		items = items.map(item => ({
			...item,
			displayMember: translate.instant(item.displayMember).text
		}));

		const config: ILookupConfig<IWorkflowSortOptions> = {
			uuid: '',
			valueMember: 'value',
			displayMember: 'displayMember'
		};

		super(items, config);
	}
}
