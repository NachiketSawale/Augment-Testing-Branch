/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { ILookupConfig, UiCommonLookupItemsDataService } from '@libs/ui/common';

export interface INotificationSortSetting {
	id: number;
	value: string;
	property: string;
	desc: boolean;
	displayMember: string
}

@Injectable({
	providedIn: 'root'
})
/**
 * Sort setting lookup for Notification panel.
 */
export class NotificationSortSettingService<TEntity extends object> extends UiCommonLookupItemsDataService<INotificationSortSetting, TEntity> {

	public constructor(private translate: PlatformTranslateService) {
		let items: INotificationSortSetting[] = [
			{
				id: 1,
				value: 'NoSorting',
				property: '',
				desc: false,
				displayMember: 'cloud.desktop.taskList.sorting.noSorting'
			},
			{
				id: 2,
				value: 'StartedAtAsc',
				property: 'Started',
				desc: false,
				displayMember: 'cloud.desktop.taskList.sorting.startDate.asc'

			},
			{
				id: 3,
				value: 'StartedAtDesc',
				property: 'Started',
				desc: true,
				displayMember: 'cloud.desktop.taskList.sorting.startDate.desc'
			},
			{
				id: 4,
				value: 'StatusAsc',
				property: 'NotificationStatus',
				desc: false,
				displayMember: 'cloud.desktop.taskList.sorting.status.asc'
			},
			{
				id: 5,
				value: 'StatusDesc',
				property: 'NotificationStatus',
				desc: true,
				displayMember: 'cloud.desktop.taskList.sorting.status.desc'
			}
		];

		items = items.map(item => ({
			...item,
			displayMember: translate.instant(item.displayMember).text
		}));

		const config: ILookupConfig<INotificationSortSetting> = {
			uuid: '',
			valueMember: 'value',
			displayMember: 'displayMember'
		};

		super(items, config);
	}
}
