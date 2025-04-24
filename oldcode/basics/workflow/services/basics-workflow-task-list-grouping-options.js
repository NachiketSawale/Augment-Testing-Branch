/* global angular */
(function (angular) {
	'use strict';
	angular.module('basics.workflow').value('basicsWorkflowTaskListGroupingOptions',
		{
			options: {
				valueMember: 'value',
				items: [
					{
						value: '',
						displayMember: 'basics.workflow.task.list.grouping.noGrouping'
					},
					{
						value: 'Clerk',
						displayMember: 'basics.workflow.task.list.grouping.clerk',
						headerValue: 'Clerk'
					},
					{
						value: 'CompanyFk',
						displayMember: 'basics.workflow.action.customEditor.company',
						headerValue: 'CompanyName'
					},
					{
						value: 'PriorityId',
						displayMember: 'basics.workflow.task.list.grouping.prio',
						headerValue: 'PriorityId'
					},
					{
						value: 'EndDate',
						displayMember: 'basics.workflow.task.list.grouping.endDate',
						headerValue: 'EndDate'
					},
					{

						value: 'Description',
						headerValue: 'Description',
						displayMember: 'basics.workflow.task.list.grouping.description'
					},
					{
						value: 'UserDefined1',
						headerValue: 'UserDefined1',
						displayMember: 'basics.workflow.task.list.grouping.userDefined1'
					},
					{
						value: 'UserDefined2',
						headerValue: 'UserDefined2',
						displayMember: 'basics.workflow.task.list.grouping.userDefined2'
					},
					{
						value: 'UserDefined3',
						headerValue: 'UserDefined3',
						displayMember: 'basics.workflow.task.list.grouping.userDefined3'
					},
					{
						value: 'UserDefined4',
						headerValue: 'UserDefined4',
						displayMember: 'basics.workflow.task.list.grouping.userDefined4'
					},
					{
						value: 'UserDefined5',
						headerValue: 'UserDefined5',
						displayMember: 'basics.workflow.task.list.grouping.userDefined5'
					},
					{
						value: 'UserDefinedMoney1',
						headerValue: 'UserDefinedMoney1',
						displayMember: 'basics.workflow.task.list.grouping.userDefinedMoney1'
					},
					{
						value: 'UserDefinedMoney2',
						headerValue: 'UserDefinedMoney2',
						displayMember: 'basics.workflow.task.list.grouping.userDefinedMoney2'
					},
					{
						value: 'UserDefinedMoney3',
						headerValue: 'UserDefinedMoney3',
						displayMember: 'basics.workflow.task.list.grouping.userDefinedMoney3'
					},
					{
						value: 'UserDefinedMoney4',
						headerValue: 'UserDefinedMoney4',
						displayMember: 'basics.workflow.task.list.grouping.userDefinedMoney4'
					},
					{
						value: 'UserDefinedMoney5',
						headerValue: 'UserDefinedMoney5',
						displayMember: 'basics.workflow.task.list.grouping.userDefinedMoney5'
					},
					{
						value: 'UserDefinedDate1',
						headerValue: 'UserDefinedDate1',
						displayMember: 'basics.workflow.task.list.grouping.userDefinedDate1'
					},
					{
						value: 'UserDefinedDate2',
						headerValue: 'UserDefinedDate2',
						displayMember: 'basics.workflow.task.list.grouping.userDefinedDate2'
					},
					{
						value: 'UserDefinedDate3',
						headerValue: 'UserDefinedDate3',
						displayMember: 'basics.workflow.task.list.grouping.userDefinedDate3'
					},
					{
						value: 'UserDefinedDate4',
						headerValue: 'UserDefinedDate4',
						displayMember: 'basics.workflow.task.list.grouping.userDefinedDate4'
					},
					{
						value: 'UserDefinedDate5',
						headerValue: 'UserDefinedDate5',
						displayMember: 'basics.workflow.task.list.grouping.userDefinedDate5'
					}
				]
			}
		}
	).value('basicsWorkflowTaskListSortingOptions',
		{
			options: {
				valueMember: 'value',
				items: [
					{
						value: '',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.noSorting'
					},

					{
						value: 'StartedAsc',
						property: 'Started',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.startAsc'
					},
					{
						value: 'StartedDesc',
						property: 'Started',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.startDesc'
					},
					{
						value: 'PrioAsc',
						property: 'Priority.Sorting',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.prioAsc'
					},
					{
						value: 'PrioDesc',
						property: 'Priority.Sorting',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.prioDesc'
					},
					{
						value: 'EndtimeDesc',
						property: 'Endtime',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.endTimeDesc'
					},
					{
						value: 'EndtimeAsc',
						property: 'Endtime',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.endTimeAsc'
					},
					{
						value: 'UserDefined1Desc',
						property: 'UserDefined1',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.userDefined1Desc'
					},
					{
						value: 'UserDefined1Asc',
						property: 'UserDefined1',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.userDefined1Asc'
					},
					{
						value: 'UserDefined2Desc',
						property: 'UserDefined2',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.userDefined2Desc'
					},
					{
						value: 'UserDefined2Asc',
						property: 'UserDefined2',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.userDefined2Asc'
					},
					{
						value: 'UserDefined3Desc',
						property: 'UserDefined3',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.userDefined3Desc'
					},
					{
						value: 'UserDefined3Asc',
						property: 'UserDefined3',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.userDefined3Asc'
					},
					{
						value: 'UserDefined4Desc',
						property: 'UserDefined4',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.userDefined4Desc'
					},
					{
						value: 'UserDefined4Asc',
						property: 'UserDefined4',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.userDefined4Asc'
					},
					{
						value: 'UserDefined5Desc',
						property: 'UserDefined5',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.userDefined5Desc'
					},
					{
						value: 'UserDefined5Asc',
						property: 'UserDefined5',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.userDefined5Asc'
					},
					{
						value: 'UserDefinedMoney1Desc',
						property: 'UserDefinedMoney1',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedMoney1Desc'
					},
					{
						value: 'UserDefinedMoney1Asc',
						property: 'UserDefinedMoney1',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedMoney1Asc'
					},
					{
						value: 'UserDefinedMoney2Desc',
						property: 'UserDefinedMoney2',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedMoney2Desc'
					},
					{
						value: 'UserDefinedMoney2Asc',
						property: 'UserDefinedMoney2',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedMoney2Asc'
					},
					{
						value: 'UserDefinedMoney3Desc',
						property: 'UserDefinedMoney3',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedMoney3Desc'
					},
					{
						value: 'UserDefinedMoney3Asc',
						property: 'UserDefinedMoney3',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedMoney3Asc'
					},
					{
						value: 'UserDefinedMoney4Desc',
						property: 'UserDefinedMoney4',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedMoney4Desc'
					},
					{
						value: 'UserDefinedMoney4Asc',
						property: 'UserDefinedMoney4',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedMoney4Asc'
					},
					{
						value: 'UserDefinedMoney5Desc',
						property: 'UserDefinedMoney5',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedMoney5Desc'
					},
					{
						value: 'UserDefinedMoney5Asc',
						property: 'UserDefinedMoney5',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedMoney5Asc'
					},
					{
						value: 'UserDefinedDate1Desc',
						property: 'UserDefinedDate1',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedDate1Desc'
					},
					{
						value: 'UserDefinedDate1Asc',
						property: 'UserDefinedDate1',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedDate1Asc'
					},
					{
						value: 'UserDefinedDate2Desc',
						property: 'UserDefinedDate2',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedDate2Desc'
					},
					{
						value: 'UserDefinedDate2Asc',
						property: 'UserDefinedDate2',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedDate2Asc'
					},
					{
						value: 'UserDefinedDate3Desc',
						property: 'UserDefinedDate3',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedDate3Desc'
					},
					{
						value: 'UserDefinedDate3Asc',
						property: 'UserDefinedDate3',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedDate3Asc'
					},
					{
						value: 'UserDefinedDate4Desc',
						property: 'UserDefinedDate4',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedDate4Desc'
					},
					{
						value: 'UserDefinedDate4Asc',
						property: 'UserDefinedDate4',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedDate4Asc'
					},
					{
						value: 'UserDefinedDate5Desc',
						property: 'UserDefinedDate5',
						desc: true,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedDate5Desc'
					},
					{
						value: 'UserDefinedDate5Asc',
						property: 'UserDefinedDate5',
						desc: false,
						displayMember: 'basics.workflow.task.list.sorting.userDefinedDate5Asc'
					}
				]
			}
		}
	).value('basicsWorkflowWorkflowListGroupingOptions', {
		options: {
			valueMember: 'value',
			items: [
				{
					value: '',
					displayMember: 'basics.workflow.task.list.grouping.noGrouping'
				},
				{
					value: 'EntityId',
					displayMember: 'basics.workflow.template.entity',
					headerValue: 'Entity'
				},
				{
					value: 'OwnerId',
					displayMember: 'basics.workflow.template.owner',
					headerValue: 'Owner'
				},
				{
					value: 'KeyUserId',
					displayMember: 'basics.workflow.template.keyUser',
					headerValue: 'KeyUser'
				}
			]
		}
	}).value('basicsWorkflowWorkflowSortingOptions', {
		options: {
			valueMember: 'value',
			items: [
				{
					value: '',
					desc: false,
					displayMember: 'basics.workflow.task.list.sorting.noSorting'
				},
				{
					value: 'DescriptionAsc',
					property: 'Description',
					desc: false,
					displayMember: 'basics.workflow.sidebar.sorting.description.asc'
				},
				{
					value: 'DescriptionDesc',
					property: 'Description',
					desc: true,
					displayMember: 'basics.workflow.sidebar.sorting.description.desc'
				}
			]
		}
	});

})(angular);
