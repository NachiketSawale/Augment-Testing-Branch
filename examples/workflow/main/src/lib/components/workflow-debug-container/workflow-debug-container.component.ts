/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnDestroy, inject } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { Subscription } from 'rxjs';
import { BasicsWorkflowTemplateDataService } from '../../services/basics-workflow-template-data.service';
import { IClientAction } from '@libs/workflow/shared';
import { IWorkflowTemplateVersion, TValue, WorkflowTemplate, WorkflowClientAction, DebugContext, IWorkflowAction, IWorkflowTransition, IWorkflowActionTask } from '@libs/workflow/interfaces';
import { WorkflowDebugDataService } from '../../services/workflow-debug/workflow-debug-context.service';
import { ConcreteMenuItem, ItemType, StandardDialogButtonId } from '@libs/ui/common';
import { IDebugContext } from '../../model/workflow-debug-context.interface';
import { WorkflowTemplateVersionDataService } from '../../services/workflow-template-version-data/workflow-template-version-data.service';
import { WorkflowClientActions } from '../../constants/workflow-client-action.class';
import { ClientActionService } from '../../services/client-action.service';
import { StartEntityWorkflowService } from '../../services/start-entity-workflow.service';
import { WorkflowInstanceService } from '../../services/workflow-instance/workflow-instance.service';
import { isString } from 'lodash';
import { BasicsWorkflowActionDataService } from '../../services/workflow-action/workflow-action.service';

/**
 * To load the context data for each debug action.
 */
@Component({
	selector: 'workflow-main-debug-container',
	templateUrl: './workflow-debug-container.component.html',
	styleUrls: ['./workflow-debug-container.component.scss'],
})
export class WorkflowDebugContainerComponent extends ContainerBaseComponent implements OnDestroy {
	/**
	 * context stores context in the form of javascript object
	 * a required parameter for next debug action
	 */
	public context!: string | DebugContext;
	/**
	 * displayContext stores the context result of each debug action in JSON format to display at debug container.
	 */
	public displayContext!: string | object | DebugContext;

	private readonly templateService = inject(BasicsWorkflowTemplateDataService);
	private readonly templateVersionService = inject(WorkflowTemplateVersionDataService);
	private readonly debugDataService = inject(WorkflowDebugDataService);
	private readonly actionService = inject(BasicsWorkflowActionDataService);
	private readonly clientActionService = inject(ClientActionService);
	private readonly startEntityWorkflowService = inject(StartEntityWorkflowService);
	private readonly instanceService = inject(WorkflowInstanceService);

	private clientActionData = new WorkflowClientActions;
	private subscriptions: Subscription[] = [];
	private selectedAction!: IWorkflowAction;
	private templateVersion!: IWorkflowTemplateVersion;
	private debugContextInfo!: IDebugContext;
	private templateData!: WorkflowTemplate;

	/**
	 * loads the template version of and its template data.
	 */
	public constructor() {
		super();

		const selectedTmplateVersionChanged$ = this.templateVersionService.selectionChanged$.subscribe((workflowTemplateVersions: IWorkflowTemplateVersion[]) => {
			if (workflowTemplateVersions.length > 0) {
				this.templateVersion = workflowTemplateVersions[0];
				let workflowActions = workflowTemplateVersions[0].WorkflowAction;
				if (typeof (workflowActions) === 'string') {
					workflowActions = JSON.parse(workflowTemplateVersions[0].WorkflowAction as string) as IWorkflowAction;
				}
				this.selectedAction = workflowActions;
				this.cancelDebugAction();

			}
		});

		const selectedTemplateChanged$ = this.templateService.selectionChanged$.subscribe((selectedTemplates) => {
			this.templateData = selectedTemplates[0];
		});

		const selectedActionChanged$ = this.actionService.selectedAction$.subscribe((selectedAction) => {
			if (selectedAction) {
				this.selectedAction = selectedAction;
			}
		});

		this.subscriptions = [selectedTmplateVersionChanged$, selectedTemplateChanged$, selectedActionChanged$];
		this.setTools();
	}

	/**
	 * toolbar feature for debug container.
	 */
	public setTools() {
		const toolbarObjItems: ConcreteMenuItem[] = [
			{id: 'd0', type: ItemType.Divider, isSet: true},
			{
				caption: {key: 'basics.workflow.debugAction.debug'},
				disabled: false,
				hideItem: false,
				iconClass: 'tlb-icons ico-workflow-run',
				id: 'debug',
				fn: () => {
					this.createContext();
				},
				sort: 1,
				permission: '#c',
				type: ItemType.Item,
			},
			{id: 'd0', type: ItemType.Divider, isSet: true},
			{
				caption: {key: 'basics.workflow.debugAction.next'},
				disabled: false,
				hideItem: false,
				iconClass: 'tlb-icons ico-workflow-next',
				id: 'next',
				fn: () => {
					this.debugAction();
				},
				sort: 2,
				permission: '#c',
				type: ItemType.Item,
			},
			{id: 'd1', type: ItemType.Divider, isSet: true},
			{
				caption: {key: 'basics.workflow.debugAction.cancel'},
				disabled: false,
				hideItem: false,
				iconClass: 'tlb-icons ico-workflow-cancel',
				id: 'cancel',
				fn: () => {
					this.cancelDebugAction();
				},
				sort: 3,
				permission: '#c',
				type: ItemType.Item,
			}
		];
		this.uiAddOns.toolbar.addItems(toolbarObjItems);
	}

	/**
	 * this function sets the base context for debug action process.
	 */
	private async createContext() {
		this.debugContextInfo = {
			TemplateId: this.templateVersion.WorkflowTemplateId,
			VersionId: this.templateVersion.Id,
			Identification: null,
			JsonContext: ' '
		};

		const handleDebug = (context: string) => {
			this.context = context;
			this.debugAction();
		};
		const startDebug = () => this.debugDataService.createContext(this.debugContextInfo).then(handleDebug);

		if (this.templateData.EntityId !== '0') {
			const result = await this.startEntityWorkflowService.show();
			if (result && result.closingButtonId == StandardDialogButtonId.Ok && result.value) {
				this.debugContextInfo.Identification = result.value;
				startDebug();
			}

		} else {
			startDebug();
		}
	}

	/**
	 * this function provides context and result of current workflow action based on its input and
	 * output configuration.
	 */
	private async debugAction() {

		const _options: { id: string; parameter: string }[] = [];
		if (this.selectedAction.transitions && this.selectedAction.transitions.length > 0) {
			this.selectedAction.transitions.forEach((transition) => {
				if (transition.parameter !== undefined && !_options.find((opt) => opt.id === transition.parameter)) {
					_options.push({
						id: transition.parameter,
						parameter: transition.workflowAction.description ? transition.workflowAction.description : transition.parameter
					});
				}
			});
		}

		const clientActionInfo: IClientAction<void> = this.clientActionData.getClientActionById(this.selectedAction.actionId as WorkflowClientAction);
		let evaluationResult = true;
		if ((this.selectedAction.executeCondition !== undefined || this.selectedAction.executeCondition !== null) && typeof this.selectedAction.executeCondition === 'boolean') {
			evaluationResult = await this.executeCondition(this.selectedAction.executeCondition);
		}

		if (clientActionInfo) {
			if (evaluationResult) {
				if (isString(this.context)) {
					this.context = JSON.parse(this.context) as DebugContext;
				}
				const context: DebugContext = this.context;
				const result = await this.clientActionService.prepareAndExecuteAction<DebugContext>(this.selectedAction as unknown as IWorkflowActionTask, clientActionInfo, context);

				if (result && result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
					this.context = result.value;
				} else if (!result || result && result.closingButtonId !== StandardDialogButtonId.Ok) {
					return;
				}
			} else {
				if (typeof this.context === 'object' && this.context !== null) {
					if ('SkippedActions' in this.context && Array.isArray(this.context['SkippedActions'])) {
						this.context['SkippedActions'].push((`Action ${this.selectedAction.description} skipped with execute Condition ${this.selectedAction.executeCondition}` as string));
					} else {
						(this.context as Record<string, TValue>)['SkippedActions'] = `Action ${this.selectedAction.description} skipped with execute Condition ${this.selectedAction.executeCondition}`;
					}
				}
			}

			this.displayContext = JSON.stringify(this.context, null, 2);
			this.findNextAction(this.selectedAction);
		} else {
			const updatedAction = {
				...this.selectedAction,
				options: _options,
				transitions: [],
			};

			const wfData = JSON.stringify(updatedAction);
			const context = JSON.stringify(this.context);

			this.debugDataService.debugAction(wfData, context).then((response) => {
				if (response.context) {
					const _context = JSON.parse(JSON.stringify(response.context));
					this.context = JSON.parse(_context);
					this.displayContext = JSON.stringify(this.context, null, 2);
					this.findNextAction(this.selectedAction, response.result);
				}
			});
		}
	}

	/**
	 * this function will clear the context data on container.
	 */
	private cancelDebugAction() {
		this.context = {} as DebugContext;
		this.displayContext = JSON.stringify(this.context, null, 2);
		this.selectedAction = {} as IWorkflowAction;
		if (this.templateVersion) {
			this.resetAction(this.templateVersion);
		}
	}

	/**
	 * stores the next action present in current action transition.
	 * @param selectedAction
	 * @param result
	 */
	private findNextAction(selectedAction: IWorkflowAction, result?: Record<string, TValue>) {
		if (selectedAction.transitions.length <= 1) {
			selectedAction = selectedAction.transitions[0].workflowAction;
		} else {
			const currentTrans = selectedAction.transitions.find((item: IWorkflowTransition) => {
				return item.parameter.toUpperCase() === result?.toString().toUpperCase();
			});

			if (currentTrans) {
				selectedAction = currentTrans.workflowAction;
			} else {
				selectedAction = selectedAction.transitions[0].workflowAction;
			}
		}
		this.actionService.selectedAction$.next(selectedAction);
	}

	private async executeCondition(condition: string): Promise<boolean> {
		const _context = JSON.stringify(this.context);
		const evaluationResult = await this.debugDataService.evaluateExecuteCondition(condition, _context);
		return evaluationResult['result'] === 'True';
	}

	private resetAction(templateVerison: IWorkflowTemplateVersion) {
		let workflowActions = templateVerison.WorkflowAction;
		if (typeof (workflowActions) === 'string') {
			workflowActions = JSON.parse(templateVerison.WorkflowAction as string) as IWorkflowAction;
		}
		this.selectedAction = workflowActions;
		this.actionService.selectedAction$.next(this.selectedAction);
	}

	public override ngOnDestroy() {
		this.subscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
		super.ngOnDestroy();
	}
}