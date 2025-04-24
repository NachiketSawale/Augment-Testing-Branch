/*
 * Copyright(c) RIB Software GmbH
 */

import { IWorkflowTemplateVersion } from './workflow-template-version.interface';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IWorkflowSubscribedEvent } from './workflow-subscribed-event.interface';

/**
 * Workflow template properties
 */
export class WorkflowTemplate implements IEntityIdentification, CompleteIdentification<WorkflowTemplate> {
	public Id!: number;
	public Description!: string;
	public KindId!: number;
	public TypeId!: number;
	public EscalationWorkflowId!: null;
	public InsertedAt!: string;
	public Status!: number;
	public EntityId!: string;
	public InsertedBy!: number;
	public UpdatedAt!: string;
	public UpdatedBy!: number;
	public Version!: number;
	public CommentText!: null;
	public IsLive!: true;
	public SearchPattern!: string;
	public OwnerId!: null;
	public Owner!: null;
	public KeyUserId!: null;
	public KeyUser!: null;
	public CompanyId!: null;
	public Company!: null;
	public RevisiondDate!: null;
	public Code!: null;
	public TemplateStatusDesc!: null;
	public Kind!: string;
	public Type!: null;
	public EscalationWorkflow!: null;
	public Entity!: null;
	public TriggerKey!: null;
	public TriggerDesc!: null;
	public IsSingleton!: false;
	public TemplateVersions!: IWorkflowTemplateVersion[];
	public SubscribedEvents!: IWorkflowSubscribedEvent[];
	public ApproverConfigList!: null;
	public AccessRightDescriptorFk?: number;
	public RetentionTime?: number;
	public DisablePermission?: boolean;
	public UseTextModuleTranslation?: boolean;
}
