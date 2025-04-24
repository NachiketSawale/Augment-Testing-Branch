/**
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupConfig, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { ITaskListSortingOption } from '../../model/interfaces/task/task-list-sorting-option.interface';

/*
 * TaskList sorting lookup
 */
@Injectable({
	providedIn: 'root'
})
export class UiSidebarTaskSortingLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<ITaskListSortingOption, TEntity> {

	public constructor() {
		const items: ITaskListSortingOption[] = [
			{
				id: 1,
				value: '',
				headerValue: 'Default Sorting',
				displayMember: 'Default Sorting'
			},
			{
				id: 2,
				value: 'Started',
				displayMember: 'basics.workflow.task.list.grouping.clerk',
				headerValue: 'By Start'
			},
			{
				id: 3,
				value: 'PriorityId',
				displayMember: 'basics.workflow.task.list.grouping.prio',
				headerValue: 'By Priority'
			},
			{
				id: 4,
				value: 'Endtime',
				displayMember: 'basics.workflow.task.list.grouping.endDate',
				headerValue: 'By End Time'
			},
			{
				id: 5,
				value: 'Description',
				headerValue: 'By Description',
				displayMember: 'basics.workflow.task.list.grouping.description'
			},
			{
				id: 6,
				value: 'UserDefined1',
				headerValue: 'By UserDefined 1',
				displayMember: 'basics.workflow.task.list.grouping.userDefined1'
			},
			{
				id: 7,
				value: 'UserDefined2',
				headerValue: 'By UserDefined 2',
				displayMember: 'basics.workflow.task.list.grouping.userDefined2'
			},
			{
				id: 8,
				value: 'UserDefined3',
				headerValue: 'By UserDefined 3',
				displayMember: 'basics.workflow.task.list.grouping.userDefined3'
			},
			{
				id: 9,
				value: 'UserDefined4',
				headerValue: 'By UserDefined 4',
				displayMember: 'basics.workflow.task.list.grouping.userDefined4'
			},
			{
				id: 10,
				value: 'UserDefined5',
				headerValue: 'By UserDefined 5',
				displayMember: 'basics.workflow.task.list.grouping.userDefined5'
			},
			{
				id: 11,
				value: 'UserDefinedMoney1',
				headerValue: 'By UserDefinedMoney 1',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedMoney1'
			},
			{
				id: 12,
				value: 'UserDefinedMoney2',
				headerValue: 'By UserDefinedMoney 2',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedMoney2'
			},
			{
				id: 13,
				value: 'UserDefinedMoney3',
				headerValue: 'By UserDefinedMoney 3',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedMoney3'
			},
			{
				id: 14,
				value: 'UserDefinedMoney4',
				headerValue: 'By UserDefinedMoney 4',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedMoney4'
			},
			{
				id: 15,
				value: 'UserDefinedMoney5',
				headerValue: 'By UserDefinedMoney 5',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedMoney5'
			},
			{
				id: 16,
				value: 'UserDefinedDate1',
				headerValue: 'By UserDefinedDate 1',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedDate1'
			},
			{
				id: 17,
				value: 'UserDefinedDate2',
				headerValue: 'By UserDefinedDate 2',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedDate2'
			},
			{
				id: 18,
				value: 'UserDefinedDate3',
				headerValue: 'By UserDefinedDate 3',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedDate3'
			},
			{
				id: 19,
				value: 'UserDefinedDate4',
				headerValue: 'By UserDefinedDate 4',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedDate4'
			},
			{
				id: 20,
				value: 'UserDefinedDate5',
				headerValue: 'By UserDefinedDate 5',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedDate5'
			}
		];

		const config: ILookupConfig<ITaskListSortingOption> = {
			uuid: 'b6c2647d860a44a28ee02af8ac12861d',
			valueMember: 'value',
			displayMember: 'headerValue',
			disableInput: true
		};

		super(items, config);
	}
}