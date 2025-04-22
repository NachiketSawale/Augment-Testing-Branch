import { IIdentificationData, LazyInjectionToken } from '@libs/platform/common';
import { WorkflowClientUuid } from './workflow-instance/enums/workflow-client-event-uuid.enum';
import { IWorkflowInstance } from './workflow-instance/interfaces/workflow-instance.interface';
import { IWorkflowActionTask } from './workflow-instance/interfaces/workflow-action-task.interface';
import { DebugContext } from './workflow-instance/interfaces/workflow-base-context.interface';
import { WorkflowContinueActionInstance } from '../types/workflow-continue-action-instance.type';

export interface IWorkflowInstanceService {
	startWorkflow: (id: number, entityIdOrIdent?: IIdentificationData | number, jsonContext?: string, suppressPopup?: boolean) => Promise<IWorkflowInstance | undefined>;
	startWorkflowByEvent: (uuid: WorkflowClientUuid, entityIdOrIdent: IIdentificationData | number | null, jsonContext: string | null, suppressPopup: boolean) => Promise<IWorkflowInstance | undefined>;
	startWorkflowBulk: (id: number, entityIdsOrIdents: number[] | IIdentificationData[], jsonContext: string) => Promise<IWorkflowInstance | undefined>;
	startWorkflowDifferentContext: (id: number, entityId: number, jsonContextList: string[], suppressPopup: boolean) => Promise<IWorkflowInstance | undefined>;
	continueWorkflow: (task: WorkflowContinueActionInstance, callback?: (instance?: IWorkflowInstance) => void) => Promise<void | IWorkflowInstance>;
	stopWorkflow: (instanceId: number) => Promise<IWorkflowInstance | undefined>;
	escalateTask: (id: number) => Promise<void>;
	escalateTaskInBulk: (taskList: string[]) => Promise<void>;
	continueWorkflowByActionInBulk: (taskList: string[]) => Promise<void>;
	registerWorkflowCallback: (fn: (instance?: IWorkflowInstance) => void) => void;
	unregisterWorkflowCallback: (fn: (instance?: IWorkflowInstance) => void) => void;
	prepareTask: (task: IWorkflowActionTask, context: object | DebugContext) => IWorkflowActionTask;
}

export const WORKFLOW_INSTANCE_SERVICE = new LazyInjectionToken<IWorkflowInstanceService>('workflow-instance-service');