/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { FieldType, createLookup } from '@libs/ui/common';
import { IWorkflowActionInstanceTask } from '@libs/workflow/shared';
import { WorkflowTaskActionInstanceDataService } from '../../service/workflow-task-action-instance-data.service';
import { WorkflowTaskActionInstanceBehaviourService } from '../../behaviour/workflow-task-action-instance-behaviour.service';
import { WorkflowActionInstancePriorityLookup, WorkflowActionInstanceStatusLookup } from '@libs/workflow/shared';
import { BasicsSharedClerkLookupService } from '@libs/basics/shared';

/**
 * Contains layout configuration for workflow task entities.
 */
export class WorkflowTaskEntityLayoutConfiguration {

	private static get moduleSubModule(): string {
		return 'Basics.Workflow'; //TODO 'Basics.WorkflowTask' (not possible for getting dtoScheme atm)
	}

	private static get taskEntityInfo(): EntityInfo {
		const actionInstanceEntityInfo: IEntityInfo<IWorkflowActionInstanceTask> = {
			grid: {
				title: {text: 'Task List', key: 'basics.workflowTask.taskList.header'},
				behavior: (ctx: IInitializationContext) => {
					return ctx.injector.get(WorkflowTaskActionInstanceBehaviourService);
				}
			},
			dtoSchemeId: {moduleSubModule: this.moduleSubModule, typeName: 'WorkflowActionInstanceSPDto'},
			permissionUuid: 'cb92e20ddca34eac90b42957eeba3771', //TODO: 'cc61d635dad841aa8ea3c8c01fa4b1ec' is containerUUid, 'cb92e20ddca34eac90b42957eeba3771' is permissionUUid which to use
			dataService: (ctx: IInitializationContext) => {
				return ctx.injector.get(WorkflowTaskActionInstanceDataService);
			},
			layoutConfiguration: {
				groups: [{
					gid: 'default-group',
					attributes: ['Id', 'ISCURRENTOWNERPROXY', 'ISTASKAVAILABLEFORPROXY', 'ISTASKOWNERABSENT', 'WorkflowInstanceId', 'Status', 'PriorityId', 'Started', 'Description', 'Comment',
						'TemplateDescription', 'OwnerId', 'Lifetime', 'Endtime', 'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5', 'UserDefinedDate1',
						'UserDefinedDate2', 'UserDefinedDate3', 'UserDefinedDate4', 'UserDefinedDate5', 'UserDefinedMoney1', 'UserDefinedMoney2', 'UserDefinedMoney3',
						'UserDefinedMoney4', 'UserDefinedMoney5', 'BusinesspartnerId', 'BusinesspartnerName1', 'BusinesspartnerName2', 'BusinesspartnerName3', 'BusinesspartnerName4']
				}],
				overloads: {
					Id: {label: {key: 'cloud.common.entityId'}, visible: true, readonly: true, sortable: true},
					ISCURRENTOWNERPROXY: {label: {key: 'basics.workflowTask.taskList.colums.isCurrentOwnerProxy'}, visible: true, readonly: true, sortable: true},
					ISTASKAVAILABLEFORPROXY: {label: {key: 'basics.workflowTask.taskList.colums.isTaskAvailableForProxy'}, visible: true, readonly: true, sortable: true},
					ISTASKOWNERABSENT: {label: {key: 'basics.workflowTask.taskList.colums.isTaskOwnerAbsent'}, visible: true, readonly: true, sortable: true},
					WorkflowInstanceId: {label: {key: 'basics.workflowTask.taskList.colums.workflowInstanceId'}, visible: true, readonly: true, sortable: true},
					Status: {
						label: {key: 'basics.workflow.action.customEditor.status'},
						visible: true,
						sortable: true,
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: WorkflowActionInstanceStatusLookup,
							readonly: true
						})
					},
					PriorityId: {
						label: {key: 'basics.workflowTask.taskList.colums.priority'},
						visible: true,
						sortable: true,
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: WorkflowActionInstancePriorityLookup,
							readonly: true
						})
					},
					Started: {label: {key: 'basics.workflowTask.taskList.colums.startTime'}, visible: true, readonly: true, sortable: true},
					Description: {label: {key: 'cloud.common.entityDescription'}, visible: true, readonly: true, sortable: true},
					Comment: {label: {key: 'cloud.common.entityComment'}, visible: true, readonly: true, sortable: true},
					TemplateDescription: {label: {key: 'basics.workflowTask.taskList.colums.templateDescription'}, visible: true, readonly: true, sortable: true},
					OwnerId: {
						label: {key: 'basics.workflowTask.taskList.colums.taskClerk'},
						visible: true,
						sortable: true,
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedClerkLookupService,
							showClearButton: true
						})
					},
					Lifetime: {label: {key: 'basics.workflow.action.detail.lifeTime'}, visible: true, readonly: true, sortable: true},
					Endtime: {label: {key: 'basics.workflowTask.taskList.colums.endBefore'}, visible: true, readonly: true, sortable: true},
					UserDefined1: {label: {key: 'basics.workflowTask.taskList.colums.userDefined1'}, visible: true, type: FieldType.Comment, sortable: true},
					UserDefined2: {label: {key: 'basics.workflowTask.taskList.colums.userDefined2'}, visible: true, type: FieldType.Comment, sortable: true},
					UserDefined3: {label: {key: 'basics.workflowTask.taskList.colums.userDefined3'}, visible: true, type: FieldType.Comment, sortable: true},
					UserDefined4: {label: {key: 'basics.workflowTask.taskList.colums.userDefined4'}, visible: true, type: FieldType.Comment, sortable: true},
					UserDefined5: {label: {key: 'basics.workflowTask.taskList.colums.userDefined5'}, visible: true, type: FieldType.Comment, sortable: true},
					UserDefinedDate1: {label: {key: 'basics.workflow.action.detail.userDefinedDate1'}, visible: true, type: FieldType.Comment, sortable: true},
					UserDefinedDate2: {label: {key: 'basics.workflow.action.detail.userDefinedDate2'}, visible: true, type: FieldType.Comment, sortable: true},
					UserDefinedDate3: {label: {key: 'basics.workflow.action.detail.userDefinedDate3'}, visible: true, type: FieldType.Comment, sortable: true},
					UserDefinedDate4: {label: {key: 'basics.workflow.action.detail.userDefinedDate4'}, visible: true, type: FieldType.Comment, sortable: true},
					UserDefinedDate5: {label: {key: 'basics.workflow.action.detail.userDefinedDate5'}, visible: true, type: FieldType.Comment, sortable: true},
					UserDefinedMoney1: {label: {key: 'basics.workflow.action.detail.userDefinedMoney1'}, visible: true, type: FieldType.Comment, sortable: true},
					UserDefinedMoney2: {label: {key: 'basics.workflow.action.detail.userDefinedMoney2'}, visible: true, type: FieldType.Comment, sortable: true},
					UserDefinedMoney3: {label: {key: 'basics.workflow.action.detail.userDefinedMoney3'}, visible: true, type: FieldType.Comment, sortable: true},
					UserDefinedMoney4: {label: {key: 'basics.workflow.action.detail.userDefinedMoney4'}, visible: true, type: FieldType.Comment, sortable: true},
					UserDefinedMoney5: {label: {key: 'basics.workflow.action.detail.userDefinedMoney5'}, visible: true, type: FieldType.Comment, sortable: true},
					BusinesspartnerId: {label: {key: 'basics.workflow.action.detail.businessPartner'}, visible: true, readonly: true, type: FieldType.Comment, sortable: true},
					BusinesspartnerName1: {label: {key: 'basics.workflowTask.taskList.colums.businessPartnerName1'}, visible: true, readonly: true, type: FieldType.Comment, sortable: true},
					BusinesspartnerName2: {label: {key: 'basics.workflowTask.taskList.colums.businessPartnerName2'}, visible: true, readonly: true, type: FieldType.Comment, sortable: true},
					BusinesspartnerName3: {label: {key: 'basics.workflowTask.taskList.colums.businessPartnerName3'}, visible: true, readonly: true, type: FieldType.Comment, sortable: true},
					BusinesspartnerName4: {label: {key: 'basics.workflowTask.taskList.colums.businessPartnerName4'}, visible: true, readonly: true, type: FieldType.Comment, sortable: true},
				}
			}
		};
		return EntityInfo.create(actionInstanceEntityInfo);
	}

	/**
	 * Returns all available entities in workflow task module.
	 */
	public static get entityInfo(): EntityInfo[] {
		return [
			this.taskEntityInfo
		];
	}
}