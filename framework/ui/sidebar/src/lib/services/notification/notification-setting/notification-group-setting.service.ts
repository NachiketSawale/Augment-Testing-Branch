/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { ILookupConfig, UiCommonLookupItemsDataService } from '@libs/ui/common';

export interface INotificationGroupSetting {
	id: number;
	value: string;
	displayMember: string;
}

@Injectable({
	providedIn: 'root'
})
/**
 * Group setting lookup service for Notification panel.
 */
export class NotificationGroupSettingService<TEntity extends object> extends UiCommonLookupItemsDataService<INotificationGroupSetting, TEntity> {

	public constructor(private translate: PlatformTranslateService) {
		let items: INotificationGroupSetting[] = [
			{
				id: 1,
				value: 'noGrouping',
				displayMember: 'cloud.desktop.taskList.grouping.noGrouping',
			},
			{
				id: 2,
				value: 'Started',
				displayMember: 'cloud.desktop.taskList.grouping.startDate',
			},
			{
				id: 3,
				value: 'NotificationStatus',
				displayMember: 'cloud.desktop.taskList.grouping.status',
			},
			{
				id: 4,
				value: 'CurrentAction',
				displayMember: 'cloud.desktop.taskList.grouping.action',

			},
			{
				id: 5,
				value: 'NotificationType',
				displayMember: 'cloud.desktop.taskList.grouping.type',
			}
		];

		items = items.map(items => ({
			...items,
			displayMember: translate.instant(items.displayMember).text
		}));

		const config: ILookupConfig<INotificationGroupSetting> = {
			uuid: '',
			valueMember: 'value',
			displayMember: 'displayMember',
			disableInput: false
		};

		super(items, config);
	}
}
