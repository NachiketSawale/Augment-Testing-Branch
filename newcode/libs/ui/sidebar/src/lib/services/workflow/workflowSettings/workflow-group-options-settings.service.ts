/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { ILookupConfig, UiCommonLookupItemsDataService } from '@libs/ui/common';


export interface IWorkflowGroupOtions {
	id: number;
	displayMember: string;
	value: string;
	headerValue: string;
}
@Injectable({
	providedIn: 'root'
})
export class WorkflowGroupOptionsSettingsService<TEntity extends object> extends UiCommonLookupItemsDataService<IWorkflowGroupOtions, TEntity> {

	public constructor(private translate: PlatformTranslateService) {
		let items: IWorkflowGroupOtions[] = [
			{
				id: 1,
				value: '',
				displayMember: 'cloud.desktop.taskList.grouping.noGrouping',
				headerValue: ''
			},
			{
				id: 2,
				value: 'EntityId',
				displayMember: 'cloud.desktop.sidebar.workflow.entity',
				headerValue: 'Entity'
			},
			{
				id: 3,
				value: 'OwnerId',
				displayMember: 'cloud.desktop.sidebar.workflow.owner',
				headerValue: 'Owner'
			},
			{
				id: 4,
				value: 'KeyUserId',
				displayMember: 'cloud.desktop.sidebar.workflow.keyUser',
				headerValue: 'KeyUser'

			},

		];

		items = items.map(items => ({
			...items,
			displayMember: translate.instant(items.displayMember).text
		}));

		const config: ILookupConfig<IWorkflowGroupOtions> = {
			uuid: '',
			valueMember: 'headerValue',
			displayMember: 'displayMember',
			disableInput: false
		};

		super(items, config);
	}
}
