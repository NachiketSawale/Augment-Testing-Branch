/**
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupConfig, UiCommonLookupItemsDataService } from '@libs/ui/common';

type WorkflowTaskListGroupingOption = {
	id: number,
	value: string,
	displayMember: string,
	headerValue: string
}

/*
 * TaskList grouping lookup
 */
@Injectable({
	providedIn: 'root'
})
export class UiSidebarTaskGroupingLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<WorkflowTaskListGroupingOption, TEntity> {

	public constructor() {
		const items: WorkflowTaskListGroupingOption[] = [
			{
				id: 1,
				value: '',
				headerValue: 'No Grouping',
				displayMember: 'No grouping'
			},
			{
				id: 2,
				value: 'Clerk',
				displayMember: 'basics.workflow.task.list.grouping.clerk',
				headerValue: 'Group by Clerk'
			},
			{
				id: 3,
				value: 'PriorityId',
				displayMember: 'basics.workflow.task.list.grouping.prio',
				headerValue: 'Group by Priority'
			},
			{
				id: 4,
				value: 'Endtime',
				displayMember: 'basics.workflow.task.list.grouping.endDate',
				headerValue: 'End Date'
			},
			{
				id: 5,
				value: 'Description',
				headerValue: 'Group by Description',
				displayMember: 'basics.workflow.task.list.grouping.description'
			},
			{
				id: 6,
				value: 'UserDefined1',
				headerValue: 'UserDefined 1',
				displayMember: 'basics.workflow.task.list.grouping.userDefined1'
			},
			{
				id: 7,
				value: 'UserDefined2',
				headerValue: 'UserDefined 2',
				displayMember: 'basics.workflow.task.list.grouping.userDefined2'
			},
			{
				id: 8,
				value: 'UserDefined3',
				headerValue: 'UserDefined 3',
				displayMember: 'basics.workflow.task.list.grouping.userDefined3'
			},
			{
				id: 9,
				value: 'UserDefined4',
				headerValue: 'UserDefined 4',
				displayMember: 'basics.workflow.task.list.grouping.userDefined4'
			},
			{
				id: 10,
				value: 'UserDefined5',
				headerValue: 'UserDefined 5',
				displayMember: 'basics.workflow.task.list.grouping.userDefined5'
			},
			{
				id: 11,
				value: 'UserDefinedMoney1',
				headerValue: 'UserDefinedMoney 1',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedMoney1'
			},
			{
				id: 12,
				value: 'UserDefinedMoney2',
				headerValue: 'UserDefinedMoney 2',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedMoney2'
			},
			{
				id: 13,
				value: 'UserDefinedMoney3',
				headerValue: 'UserDefinedMoney 3',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedMoney3'
			},
			{
				id: 14,
				value: 'UserDefinedMoney4',
				headerValue: 'UserDefinedMoney 4',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedMoney4'
			},
			{
				id: 15,
				value: 'UserDefinedMoney5',
				headerValue: 'UserDefinedMoney 5',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedMoney5'
			},
			{
				id: 16,
				value: 'UserDefinedDate1',
				headerValue: 'UserDefinedDate 1',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedDate1'
			},
			{
				id: 17,
				value: 'UserDefinedDate2',
				headerValue: 'UserDefinedDate 2',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedDate2'
			},
			{
				id: 18,
				value: 'UserDefinedDate3',
				headerValue: 'UserDefinedDate 3',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedDate3'
			},
			{
				id: 19,
				value: 'UserDefinedDate4',
				headerValue: 'UserDefinedDate 4',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedDate4'
			},
			{
				id: 20,
				value: 'UserDefinedDate5',
				headerValue: 'UserDefinedDate 5',
				displayMember: 'basics.workflow.task.list.grouping.userDefinedDate5'
			}
		];

		const config: ILookupConfig<WorkflowTaskListGroupingOption> = {
			uuid: 'e838fad2062642bab0ae656acc7d9662',
			valueMember: 'value',
			displayMember: 'headerValue',
			disableInput: true
		};

		super(items, config);
	}
}