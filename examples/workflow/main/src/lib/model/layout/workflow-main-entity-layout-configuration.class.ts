/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { WorkflowTemplateBehaviourService } from '../../behaviours/workflow-template-behaviour.service';
import { BasicsWorkflowTemplateDataService } from '../../services/basics-workflow-template-data.service';
import { FieldType, ILookupContext, createLookup } from '@libs/ui/common';
import { WorkflowKindLookup } from '../../services/workflow-lookup/workflow-kind-lookup.service';
import {
	IWorkflowApproverConfigEntity,
	IWorkflowKind, WorkflowSubscribedEventLookupItem,
	IWorkflowTemplateContext
} from '@libs/workflow/shared';
import { IWorkflowSubscribedEvent, IWorkflowTemplateVersion, WorkflowTemplate } from '@libs/workflow/interfaces';
import { WorkflowTypeLookup } from '../../services/workflow-lookup/workflow-type-lookup.service';
import { WorkflowTemplateVersionBehaviour } from '../../behaviours/workflow-template-version-behaviour.service';
import {
	WorkflowTemplateVersionDataService
} from '../../services/workflow-template-version-data/workflow-template-version-data.service';
import {
	WorkflowApproverConfigDataService
} from '../../services/workflow-approver-config-data/workflow-approver-config-data.service';
import { WorkflowApproverBehaviour } from '../../behaviours/workflow-approver-config-behaviour.service';
import { EntityDomainType } from '@libs/platform/data-access';
import {
	WorkflowTemplateContextService
} from '../../services/workflow-template-context/workflow-template-context.service';
import { BasicsCompanyLookupService, BasicsSharedClerkLookupService } from '@libs/basics/shared';
import { WorkflowEntityLookup } from '../../services/workflow-lookup/workflow-entity-lookup.service';
import { EscalationWorkflowLookup } from '../../services/workflow-lookup/workflow-escalation-workflow-lookup.service';
import { WorkflowSubscribedEventService } from '../../services/workflow-subscribed-event/workflow-subscribed-event.service';
import { WorkflowSubscribedEventLookup } from '../../services/workflow-lookup/workflow-subscribed-event-lookup.service';

/**
 * Contains layout configuration for workflow entities.
 */
export class WorkflowMainEntityLayoutConfiguration {

	private static get moduleSubModule(): string {
		return 'Basics.Workflow';
	}

	private static templateEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {text: 'Workflow templates', key: 'basics.workflow.template.containerHeader'},
			behavior: (ctx: IInitializationContext) => {
				return ctx.injector.get(WorkflowTemplateBehaviourService);
			}
		},
		dtoSchemeId: {moduleSubModule: this.moduleSubModule, typeName: 'TemplateDto'},
		dataService: (ctx: IInitializationContext) => {
			return ctx.injector.get(BasicsWorkflowTemplateDataService);
		},
		layoutConfiguration: {
			groups: [{
				gid: 'default-group',
				attributes: ['Id', 'Description', 'EscalationWorkflowId', 'EntityId', 'KindId', 'TypeId', 'KeyUserId', 'OwnerId', 'CompanyId', 'CommentText', 'RetentionTime', 'DisablePermission', 'IsSingleton', 'UseTextModuleTranslation']
			}],
			overloads: {
				Id: {label: {key: 'basics.workflow.action.customEditor.id'}, readonly: true},
				Description: {label: {key: 'basics.workflow.template.description'}, width: 300},
				EscalationWorkflowId: {
					label: {key: 'basics.workflow.template.type.2'},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: EscalationWorkflowLookup
					})
				},
				EntityId: {
					label: {key: 'basics.workflow.template.entity'},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: WorkflowEntityLookup
					})
				},
				KindId: {
					label: {key: 'basics.workflow.template.kind'},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: WorkflowKindLookup,
						formatter: { //Used to format how data is displayed in lookup dropdown/grid
							format: (dataItem: IWorkflowKind, context: ILookupContext<IWorkflowKind, WorkflowTemplate>) => {
								return dataItem.Description;
							}
						},
						displayMember: 'Description',
						valueMember: 'Id'
					})
				},
				TypeId: {
					label: {key: 'basics.workflow.template.type.description'},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: WorkflowTypeLookup
					})
				},
				CommentText: {label: {key: 'basics.workflow.template.comment'}},
				KeyUserId: {
					label: {key: 'basics.workflow.template.keyUser'},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService
					})
				},
				OwnerId: {
					label: {key: 'basics.workflow.template.owner'},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService
					})
				},
				CompanyId: {
					label: {key: 'basics.workflow.action.customEditor.company'},
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsCompanyLookupService
					})
				},
				RetentionTime: {label: {key: 'basics.workflow.template.RetentionTime'}},
				DisablePermission: {label: {key: 'basics.workflow.template.disablePermission'}},
				IsSingleton: {label: {key: 'basics.workflow.template.isSingleton'}},
				UseTextModuleTranslation: {label: {key: 'basics.workflow.template.useTextModuleTranslation'}},
			}
		},
		permissionUuid: '14d5f58009ff11e5a6c01697f925ec7b',
		entityFacadeId: '7A9C1CCBC0D74409A7249A50A3EA225B'
	} as IEntityInfo<WorkflowTemplate>);

	private static templateVersionEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {text: 'Workflow Template Versions', key: 'basics.workflow.template.version.containerHeader'},
			behavior: (ctx: IInitializationContext) => {
				return ctx.injector.get(WorkflowTemplateVersionBehaviour);
			}
		},
		dataService: (ctx: IInitializationContext) => {
			return ctx.injector.get(WorkflowTemplateVersionDataService);
		},
		dtoSchemeId: {moduleSubModule: this.moduleSubModule, typeName: 'TemplateVersionDto'},
		permissionUuid: 'a8601aedc43e42fab13fee63a84d01f6',
		layoutConfiguration: {
			groups: [{gid: 'default-group', attributes: ['Id', 'TemplateVersion', 'Comment', 'Helptext', 'Lifetime', 'Status']}],
			overloads: {
				Id: {label: {text: 'Id', key: 'basics.workflow.action.customEditor.id'}, readonly: true},
				TemplateVersion: {label: {text: 'Version', key: 'basics.workflow.template.templateVersion'}},
				Comment: {label: {text: 'Comment', key: 'basics.workflow.template.comment'}},
				Helptext: {label: {text: 'Helptext', key: 'basics.workflow.template.helpText'}},
				Lifetime: {label: {text: 'Lifetime', key: 'basics.workflow.template.lifeTime'}},
				Status: {label: {text: 'Status', key: 'basics.workflow.template.status'}},
			},
			transientFields: [{
				id: 'Status',
				type: FieldType.Image,
				model: 'StatusImage',
				readonly: true
			}],
		}
	} as IEntityInfo<IWorkflowTemplateVersion>);


	private static approverConfigEntityInfo: EntityInfo = EntityInfo.create({
		grid: {
			title: {text: 'Workflow Approver Config', key: 'basics.workflow.approver.approverConfigContainerTitle'},
			behavior: (ctx: IInitializationContext) => {
				return ctx.injector.get(WorkflowApproverBehaviour);
			}
		},
		dtoSchemeId: {moduleSubModule: this.moduleSubModule, typeName: 'ApproverConfigDto'},
		layoutConfiguration: {
			groups: [{
				gid: 'default-group',
				attributes: ['Id', 'AllowReject2Level', 'ClassifiedAmount', 'ClassifiedDate', 'ClassifiedNum', 'ClassifiedText', 'ClerkRoleFk', 'EvaluationLevel', 'Formular', 'InsertedAt', 'InsertedBy', 'IsMail', 'IsSendMailToClerk', 'NeedComment4Approve', 'NeedComment4Reject', 'TimeToApprove', 'UpdatedAt', 'UpdatedBy']
			}],
			overloads: {
				Id: {label: {text: 'Id', key: 'basics.workflow.action.customEditor.id'}, readonly: true},
				AllowReject2Level: {
					label: {text: 'Allow Rejection', key: 'basics.workflow.approver.allowreject2level'}
				},
				ClassifiedAmount: {
					label: {text: 'Classified Amount', key: 'basics.workflow.approver.classifiedAmount'}
				},
				ClassifiedDate: {label: {text: 'Classified Date', key: 'basics.workflow.approver.classifiedDate'}},
				ClassifiedNum: {label: {text: 'Classified Number', key: 'basics.workflow.approver.classifiedNum'}},
				ClassifiedText: {label: {text: 'Classified Text', key: 'basics.workflow.approver.classifiedText'}},
				ClerkRoleFk: {label: {text: 'Clerk Role', key: 'basics.workflow.approver.clerkRole'},},
				EvaluationLevel: {label: {text: 'Evaluation Level', key: 'basics.workflow.approver.evaluationLevel'}},
				Formular: {label: {text: 'Formula', key: 'basics.workflow.approver.formular'}},
				IsMail: {label: {text: 'Send mail?', key: 'basics.workflow.approver.isMail'}},
				IsSendMailToClerk: {
					label: {
						text: 'Send mail to clerk?',
						key: 'basics.workflow.approver.isSendMailToClerk'
					}
				},
				NeedComment4Approve: {
					label: {
						text: 'Need comment for approval?',
						key: 'basics.workflow.approver.needComment4Approve'
					}
				},
				NeedComment4Reject: {
					label: {
						text: 'Need comment for reject?',
						key: 'basics.workflow.approver.needComment4Reject'
					}
				},
				TimeToApprove: {label: {text: 'Time to approve', key: 'basics.workflow.approver.timeToApprove'}},
				InsertedAt: {label: {text: 'Inserted At', key: 'basics.workflow.insertedAt'}},
				InsertedBy: {label: {text: 'Inserted By', key: 'basics.workflow.insertedBy'}},
				UpdatedAt: {label: {text: 'Updated At', key: 'basics.workflow.updatedAt'}},
				UpdatedBy: {label: {text: 'Updated By', key: 'basics.workflow.updatedBy'}},
			}
		},
		permissionUuid: '1517256d3ba543dcbdb76fe973ee8087',
		dataService: (ctx: IInitializationContext) => {
			return ctx.injector.get(WorkflowApproverConfigDataService);
		}
	} as IEntityInfo<IWorkflowApproverConfigEntity>);


	private static templateContext: EntityInfo = EntityInfo.create({
		grid: {
			title: {text: 'Template Context', key: 'basics.workflow.template.context.containerHeaderNew'},

		},
		dtoSchemeId: {moduleSubModule: this.moduleSubModule, typeName: ''},
		layoutConfiguration: {
			groups: [{gid: 'default-group', attributes: ['Id', 'key', 'value']}],
			overloads: {
				Id: {label: {key: 'basics.workflow.action.customEditor.id'}, readonly: true},
				key: {label: {key: 'basics.workflow.template.context.key'}},
				value: {label: {key: 'basics.workflow.template.context.value'}}
			}
		},
		permissionUuid: '8d61c1ee263a11e5b345feff819cdc9f',
		dataService: (ctx: IInitializationContext) => {
			return ctx.injector.get(WorkflowTemplateContextService);
		},
		entitySchema: {
			properties: {
				Id: {domain: EntityDomainType.Integer, mandatory: true},
				key: {domain: EntityDomainType.Description, mandatory: true},
				value: {domain: EntityDomainType.Description, mandatory: true}
			},
			schema: ''
		}
	} as IEntityInfo<IWorkflowTemplateContext>);

	private static subscribedEventEntityInfo: EntityInfo = EntityInfo.create({
		grid: { //TODO: remove unnecessary toolbar items
			title: {text: 'Subscribed Events', key: 'basics.workflow.subscribedEvents.containerHeader'}
		},
		dtoSchemeId: {moduleSubModule: this.moduleSubModule, typeName: ''},
		layoutConfiguration: {
			groups: [{gid: 'default-group', attributes: ['Id', 'Uuid']}],
			overloads: {
				Id: {label: {key: 'basics.workflow.action.customEditor.id'}, readonly: true},
				Uuid: {
					label: {key: 'basics.workflow.subscribedEvents.event'},
					type: FieldType.Lookup,
					lookupOptions: createLookup<IWorkflowSubscribedEvent, WorkflowSubscribedEventLookupItem>({
						dataServiceToken: WorkflowSubscribedEventLookup
					})
				}
			}
		},
		permissionUuid: '201f20c6e7be494dbc81252a5f0ee50f',
		dataService: (ctx: IInitializationContext) => {
			return ctx.injector.get(WorkflowSubscribedEventService);
		},
		entitySchema: {
			properties: {
				Id: {domain: EntityDomainType.Integer, mandatory: true},
				Uuid: {domain: EntityDomainType.Description, mandatory: true}
			},
			schema: ''
		}
	} as IEntityInfo<IWorkflowSubscribedEvent>);

	/**
	 * Returns all available entities in workflow main module.
	 */
	public static get entityInfo(): EntityInfo[] {
		return [
			this.templateEntityInfo,
			this.templateVersionEntityInfo,
			this.approverConfigEntityInfo,
			this.templateContext,
			this.subscribedEventEntityInfo
		];
	}
}