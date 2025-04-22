/*
 * Copyright(c) RIB Software GmbH
 */

export interface TemplateImport {
	Id: number;
	Description: string;
	TemplateVersion?: number;
	Status?: number;
	Comment: string | null;
	Helptext: string | null;
	Context: string
	WorkflowAction: string
	Lifetime: number
	WorkflowTemplateId: number
	EntityId: string
	CommentText: string | null;
	KindId?: number
	TypeId?: number
	OwnerId?: number | null;
	KeyUserId?: number | null;
	CompanyId?: number | null;
	Version: number
	EscalationWorkflowId?: number
	IsLive: boolean
	UseTextModuleTranslation: boolean
	SubscribedEvents: string[]
}