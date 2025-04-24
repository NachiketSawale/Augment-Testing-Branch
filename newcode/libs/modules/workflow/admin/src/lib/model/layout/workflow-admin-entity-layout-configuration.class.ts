/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { IWorkflowActionInstanceHistory } from '@libs/workflow/shared';
import { IWorkflowInstance } from '@libs/workflow/interfaces';
import { WorkflowInstanceBehaviourService } from '../../behaviour/workflow-instance-behaviour.service';
import { BasicsWorkflowInstanceDataService } from '../../services/basics-workflow-instance-data.service';
import { EntityDomainType } from '@libs/platform/data-access';
import { WorkflowActionInstanceBehaviour } from '../../behaviour/workflow-action-instance-behaviour.service';
import { BasicsWorkflowActionInstanceDataService } from '../../services/basics-workflow-action-instance-data.service';
import { createLookup, FieldType, IGridTreeConfiguration } from '@libs/ui/common';
import { BasicsSharedClerkLookupService } from '@libs/basics/shared';
import { BasicsWorkflowClientActionInstanceDataService } from '../../services/basics-workflow-client-action-instance-data.service';
import { IWorkflowClientActionInstanceInterface } from '../interfaces/workflow-client-action-instance.interface';
import { WorkflowClientActionInstanceBehaviourService } from '../../behaviour/workflow-client-action-instance-behaviour.service';
import { WFE_ADMIN_APPROVER_ENTITY_INFO } from '../entity-info/workflow-admin-approver-entity-info.model';

export class WorkflowAdminEntityLayoutConfiguration {

	private static get moduleSubModule(): string {
		return 'Basics.Workflow';
	}

	private static get workflowInstanceInfo() {
		return {

			dataService: (ctx: IInitializationContext) => {
				return ctx.injector.get(BasicsWorkflowInstanceDataService);
			},
			//Todo : Remove.
			entitySchema: {
				schema: '', properties: {
					Id: {domain: EntityDomainType.Integer, mandatory: false},
					Description: {domain: EntityDomainType.Description, maxlen: 42, mandatory: false},
					StatusName: {domain: EntityDomainType.Description, mandatory: false},
					TemplateVersion: {domain: EntityDomainType.Integer, mandatory: false},
					Started: {domain: EntityDomainType.DateTime, mandatory: false},
					Endtime: {domain: EntityDomainType.DateTime, mandatory: false},
					Duration: {domain: EntityDomainType.Description, maxlen: 42, mandatory: false},
					ClerkId: {domain: EntityDomainType.Integer, mandatory: false},
					EntityId: {domain: EntityDomainType.Integer, mandatory: false},
					CompanyName: {domain: EntityDomainType.Integer, mandatory: false},
					ProjectId: {domain: EntityDomainType.Integer, mandatory: false},
					ModuleName: {domain: EntityDomainType.Description, maxlen: 42, mandatory: false},
					Version: {domain: EntityDomainType.Integer, mandatory: false},
					InsertedAt: {domain: EntityDomainType.Date, mandatory: false},
					InsertedBy: {domain: EntityDomainType.Integer, mandatory: false},
					UpdatedAt: {domain: EntityDomainType.Date, mandatory: false},
					UpdatedBy: {domain: EntityDomainType.Integer, mandatory: false}
				}
			},
			grid: {
				title: {text: 'Workflow Instance', key: 'basics.workflowAdministration.instance.containerHeader'},
				behavior: (ctx: IInitializationContext) => {
					return ctx.injector.get(WorkflowInstanceBehaviourService);
				},
				containerUuid: '3a38f0e839e811e5a151feff819cdc9f'
			},
			layoutConfiguration: {
				groups: [{gid: 'default-group', attributes: ['Id', 'Description', 'StatusName', 'TemplateVersion', 'ModuleName', 'Started', 'Endtime', 'Duration', 'ClerkId', 'CompanyName', 'EntityId', 'ProjectId', 'Version']}],
				overloads: {
					Id: {label: {text: '', key: 'basics.workflow.action.customEditor.id'}, readonly: true},
					Description: {label: {text: '', key: 'basics.workflow.action.customEditor.description'}, readonly: true},
					StatusName: {label: {text: '', key: 'basics.workflow.action.customEditor.status'}, readonly: true},
					TemplateVersion: {
						label: {text: 'Template Version', key: 'basics.workflowAdministration.instance.templateVersion'}, readonly: true, valueAccessor: {
							getValue(obj: IWorkflowInstance): number | undefined {
								return obj.TemplateVersion.TemplateVersion;
							}
						}
					},
					ModuleName: {label: {text: '', key: 'basics.workflowAdministration.instance.moduleName'}, readonly: true},
					Started: {label: {text: '', key: 'basics.workflow.action.status.started'}, readonly: true},
					Endtime: {label: {text: '', key: 'basics.workflowAdministration.common.endTime'}, readonly: true},
					Duration: {label: {text: '', key: 'basics.workflowAdministration.common.duration'}, readonly: true},
					ClerkId: {label: {text: '', key: 'basics.workflowAdministration.common.clerk'}, readonly: true},
					CompanyName: {label: {text: '', key: 'basics.workflowAdministration.instance.company'}, readonly: true},
					EntityId: {label: {text: '', key: 'basics.workflowAdministration.instance.entity'}, readonly: true},
					ProjectId: {label: {text: '', key: 'basics.workflowAdministration.instance.project'}, readonly: true},
					Version: {label: {text: '', key: 'basics.workflow.template.templateVersion'}, readonly: true}
				}
			},
			permissionUuid: '3a38f0e839e811e5a151feff819cdc9f'
		};
	}

	/**
	 * TODO : Upon the modifications at server side, remove explicit entitySchema configuration
	 * 		 from "workflowClientActionEntityInfo", "workflowInstanceEntityInfo" and "workflowActionInstanceEntityInfo".
	 */
	private static workflowClientActionEntityInfo: EntityInfo = EntityInfo.create({
		dataService: (ctx: IInitializationContext) => {
			return ctx.injector.get(BasicsWorkflowClientActionInstanceDataService);
		},
		//Todo : Remove.
		entitySchema: {
			schema: '', properties: {
				Id: {domain: EntityDomainType.Integer, mandatory: true},
				IdInTemplate: {domain: EntityDomainType.Integer, mandatory: true},
				WorkflowInstanceId: {domain: EntityDomainType.Integer, mandatory: true},
				Status: {domain: EntityDomainType.Integer, mandatory: false},
				PriorityId: {domain: EntityDomainType.Integer, mandatory: false},
				Started: {domain: EntityDomainType.DateTime, mandatory: true},
				Description: {domain: EntityDomainType.Description, mandatory: true},
				Comment: {domain: EntityDomainType.Description, mandatory: true},
				ActionId: {domain: EntityDomainType.Integer, mandatory: true},
				Context: {domain: EntityDomainType.Description, mandatory: true},
				IsRunning: {domain: EntityDomainType.Boolean, mandatory: false},
				OwnerId: {domain: EntityDomainType.Integer, mandatory: false},
				ProgressById: {domain: EntityDomainType.Integer, mandatory: false},
				Lifetime: {domain: EntityDomainType.Integer, mandatory: true},
				MaxEndtime: {domain: EntityDomainType.DateTime, mandatory: false},
				Endtime: {domain: EntityDomainType.DateTime, mandatory: false},
				ActionName: {domain: EntityDomainType.Description, mandatory: true},
				EntityInfo: {domain: EntityDomainType.Description, mandatory: true},
				Clerk: {domain: EntityDomainType.Description, mandatory: true},
				EntityDescription: {domain: EntityDomainType.Description, mandatory: true},
				TemplateDescription: {domain: EntityDomainType.Description, mandatory: true},
				Duration: {domain: EntityDomainType.Description, mandatory: false}
			}
		},
		grid: {
			title: {text: '', key: 'basics.workflowAdministration.clientAction.containerHeader'},
			behavior: (ctx: IInitializationContext) => {
				return ctx.injector.get(WorkflowClientActionInstanceBehaviourService);
			},
			containerUuid: '1973fe93e26245a39a048eacc630b81a'
		},
		layoutConfiguration: {
			groups: [{gid: 'default-group', attributes: ['Id', 'Description', 'Comments', 'Started', 'MaxEndtime', 'Endtime', 'Duration', 'IsRunning', 'Clerk', 'ProgressById']}],
			overloads: {
				Id: {label: {text: '', key: 'basics.workflow.action.customEditor.id'}, readonly: true},
				Description: {label: {text: '', key: 'basics.workflow.action.customEditor.description'}, readonly: true},
				Comment: {label: {text: '', key: 'basics.workflowAdministration.approver.comment'}, readonly: true},
				Started: {label: {text: '', key: 'basics.workflow.action.status.started'}, readonly: true},
				MaxEndtime: {label: {text: '', key: 'basics.workflowAdministration.common.maxEndTime'}, readonly: true},
				Endtime: {label: {text: '', key: 'basics.workflowAdministration.common.endTime'}, readonly: true},
				Duration: {label: {text: '', key: 'basics.workflowAdministration.common.duration'}, readonly: true},
				IsRunning: {label: {text: '', key: 'basics.workflowAdministration.action.isRunning'}, readonly: true},
				Clerk: {label: {text: '', key: 'basics.workflowAdministration.common.clerk'}, readonly: true},
				ProgressById: {label: {text: '', key: 'basics.workflowAdministration.clientAction.progressedBy'}, readonly: true},
			}
		},
		permissionUuid: '3a38f0e839e811e5a151feff819cdc9f'
	} as IEntityInfo<IWorkflowClientActionInstanceInterface>);

	private static workflowInstanceEntityInfo: EntityInfo = EntityInfo.create(this.workflowInstanceInfo as IEntityInfo<IWorkflowInstance>);

	private static workflowInstanceTreeEntityInfo: EntityInfo = EntityInfo.create({

		dataService: (ctx: IInitializationContext) => {
			return ctx.injector.get(BasicsWorkflowInstanceDataService);
		},
		entitySchema: this.workflowInstanceInfo.entitySchema,
		grid: {
			treeConfiguration: context => {
				const test: IGridTreeConfiguration<IWorkflowInstance> = {
					collapsed: true,
					parent: function (entity: IWorkflowInstance) {
						const service = context.injector.get(BasicsWorkflowInstanceDataService);
						return service.parentOf(entity);
					},
					children: function (entity: IWorkflowInstance) {
						const service = context.injector.get(BasicsWorkflowInstanceDataService);
						return service.childrenOf(entity);
					},
				} as IGridTreeConfiguration<IWorkflowInstance>;
				return test;
			},
			title: {text: '', key: 'basics.workflowAdministration.instance.treeContainerHeader'},
			behavior: (ctx: IInitializationContext) => {
				return ctx.injector.get(WorkflowInstanceBehaviourService);
			},
			containerUuid: 'c6319bbe645c45c98d1d631693607575'
		},
		layoutConfiguration: this.workflowInstanceInfo.layoutConfiguration,
		permissionUuid: '3a38f0e839e811e5a151feff819cdc9f'
	} as IEntityInfo<IWorkflowInstance>);


	private static workflowActionInstanceEntityInfo: EntityInfo = EntityInfo.create({
		dataService: (ctx: IInitializationContext) => {
			return ctx.injector.get(BasicsWorkflowActionInstanceDataService);
		},
		//Todo : Remove.
		entitySchema: {
			schema: '', properties: {
				Id: {domain: EntityDomainType.Integer, mandatory: true},
				Started: {domain: EntityDomainType.DateTime, mandatory: true},
				Endtime: {domain: EntityDomainType.DateTime, mandatory: true},
				Duration: {domain: EntityDomainType.Description, maxlen: 42, mandatory: false},
				Description: {domain: EntityDomainType.Description, maxlen: 42, mandatory: false},
				Comment: {domain: EntityDomainType.Comment, mandatory: false},
				Result: {domain: EntityDomainType.Comment, mandatory: false},
				IsRunning: {domain: EntityDomainType.Description, maxlen: 42, mandatory: false},
				UserId: {domain: EntityDomainType.Description, mandatory: false},
				ProgressedBy: {domain: EntityDomainType.Description, maxlen: 42, mandatory: false},
				Userdefined1: {domain: EntityDomainType.Description, maxlen: 42, mandatory: false},
				Userdefined2: {domain: EntityDomainType.Description, maxlen: 42, mandatory: false},
				Userdefined3: {domain: EntityDomainType.Description, maxlen: 42, mandatory: false},
				Userdefined4: {domain: EntityDomainType.Description, maxlen: 42, mandatory: false},
				Userdefined5: {domain: EntityDomainType.Description, maxlen: 42, mandatory: false},
				UserDefinedMoney1: {domain: EntityDomainType.Money, mandatory: false},
				UserDefinedMoney2: {domain: EntityDomainType.Money, mandatory: false},
				UserDefinedMoney3: {domain: EntityDomainType.Money, mandatory: false},
				UserDefinedMoney4: {domain: EntityDomainType.Money, mandatory: false},
				UserDefinedMoney5: {domain: EntityDomainType.Money, mandatory: false},
				UserDefinedDate1: {domain: EntityDomainType.Date, mandatory: false},
				UserDefinedDate2: {domain: EntityDomainType.Date, mandatory: false},
				UserDefinedDate3: {domain: EntityDomainType.Date, mandatory: false},
				UserDefinedDate4: {domain: EntityDomainType.Date, mandatory: false},
				UserDefinedDate5: {domain: EntityDomainType.Date, mandatory: false},
			}
		},
		dtoSchemeId: {moduleSubModule: this.moduleSubModule, typeName: 'ActionInstanceHistoryDto'},
		grid: {
			title: {text: '', key: 'basics.workflowAdministration.action.containerHeader'},
			behavior: (ctx: IInitializationContext) => {
				return ctx.injector.get(WorkflowActionInstanceBehaviour);
			},
			containerUuid: '59bfb75bb4624c40bd52dd8ce4e42c98'
		},
		layoutConfiguration: {
			groups: [{
				gid: 'default-group',
				attributes: ['Id', 'Description', 'Comment', 'Result', 'Started', 'Endtime', 'Duration', 'IsRunning', 'UserId', 'ProgressedBy', 'Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5', 'UserDefinedMoney1', 'UserDefinedMoney2', 'UserDefinedMoney3', 'UserDefinedMoney4', 'UserDefinedMoney5', 'UserDefinedDate1', 'UserDefinedDate2', 'UserDefinedDate3', 'UserDefinedDate4', 'UserDefinedDate5']
			}],
			overloads: {
				Id: {label: {text: '', key: 'basics.workflow.action.customEditor.id'}, readonly: true},
				Description: {label: {text: '', key: 'basics.workflow.action.customEditor.description'}, readonly: true},
				Comment: {label: {text: '', key: 'basics.workflowAdministration.approver.comment'}, readonly: true},
				Result: {label: {text: '', key: 'basics.workflowAdministration.common.result'}, readonly: true},
				Started: {label: {text: '', key: 'basics.workflow.action.status.started'}, readonly: true},
				Endtime: {label: {text: '', key: 'basics.workflowAdministration.common.endTime'}, readonly: true},
				Duration: {label: {text: '', key: 'basics.workflowAdministration.common.duration'}, readonly: true},
				IsRunning: {label: {text: '', key: 'basics.workflowAdministration.action.isRunning'}, readonly: true},
				UserId: {
					label: {text: '', key: 'basics.workflowAdministration.common.clerk'},
					visible: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService,
						showClearButton: true
					})
				},
				ProgressedBy: {label: {text: '', key: 'basics.workflowAdministration.clientAction.progressedBy'}, readonly: true},
				Userdefined1: {label: {text: 'Userdefined1', key: 'basics.workflowAdministration.action.Userdefined1'}, readonly: true},
				Userdefined2: {label: {text: 'Userdefined2', key: 'basics.workflowAdministration.action.Userdefined2'}, readonly: true},
				Userdefined3: {label: {text: 'Userdefined3', key: 'basics.workflowAdministration.action.Userdefined3'}, readonly: true},
				Userdefined4: {label: {text: 'Userdefined4', key: 'basics.workflowAdministration.action.Userdefined4'}, readonly: true},
				Userdefined5: {label: {text: 'Userdefined5', key: 'basics.workflowAdministration.action.Userdefined5'}, readonly: true},
				UserDefinedMoney1: {label: {text: 'UserDefinedMoney1', key: 'basics.workflowAdministration.action.UserDefinedMoney1'}, readonly: true},
				UserDefinedMoney2: {label: {text: 'UserDefinedMoney2', key: 'basics.workflowAdministration.action.UserDefinedMoney2'}, readonly: true},
				UserDefinedMoney3: {label: {text: 'UserDefinedMoney3', key: 'basics.workflowAdministration.action.UserDefinedMoney3'}, readonly: true},
				UserDefinedMoney4: {label: {text: 'UserDefinedMoney4', key: 'basics.workflowAdministration.action.UserDefinedMoney4'}, readonly: true},
				UserDefinedMoney5: {label: {text: 'UserDefinedMoney5', key: 'basics.workflowAdministration.action.UserDefinedMoney5'}, readonly: true},
				UserDefinedDate1: {label: {text: 'UserDefinedDate1', key: 'basics.workflowAdministration.action.UserDefinedDate1'}, readonly: true},
				UserDefinedDate2: {label: {text: 'UserDefinedDate2', key: 'basics.workflowAdministration.action.UserDefinedDate2'}, readonly: true},
				UserDefinedDate3: {label: {text: 'UserDefinedDate3', key: 'basics.workflowAdministration.action.UserDefinedDate3'}, readonly: true},
				UserDefinedDate4: {label: {text: 'UserDefinedDate4', key: 'basics.workflowAdministration.action.UserDefinedDate4'}, readonly: true},
				UserDefinedDate5: {label: {text: 'UserDefinedDate5', key: 'basics.workflowAdministration.action.UserDefinedDate5'}, readonly: true}
			}
		},
		permissionUuid: '3a38f0e839e811e5a151feff819cdc9f'
	} as IEntityInfo<IWorkflowActionInstanceHistory>);

	/**
	 * Returns all available entities in workflow admin module.
	 */
	public static get entityInfo(): EntityInfo[] {
		return [
			this.workflowInstanceEntityInfo,
			this.workflowActionInstanceEntityInfo,
			this.workflowClientActionEntityInfo,
			this.workflowInstanceTreeEntityInfo,
			WFE_ADMIN_APPROVER_ENTITY_INFO
		];
	}
}