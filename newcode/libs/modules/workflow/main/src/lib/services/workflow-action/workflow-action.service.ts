/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IIdentificationData, PropertyType } from '@libs/platform/common';
import {
	DataServiceFlatRoot,
	IDataServiceEndPointOptions,
	IDataServiceOptions, ServiceRole, IDataServiceRoleOptions
} from '@libs/platform/data-access';
import { WorkflowActionComplete, IClientAction } from '@libs/workflow/shared';
import { IWorkflowActionDefinition, WorkflowClientAction, IWorkflowAction } from '@libs/workflow/interfaces';
import { ReplaySubject, Subject } from 'rxjs';
import { WorkflowClientActions } from '../../constants/workflow-client-action.class';
import { cloneDeep, find, get } from 'lodash';

/**
 * Stores the state of actions from current selected workflow template version
 */
type ActionState = {
	originalAction: IWorkflowAction,
	isChanged: boolean
};

/**
 * Data service to load details of all actions.
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsWorkflowActionDataService extends DataServiceFlatRoot<IWorkflowActionDefinition, WorkflowActionComplete> {

	public allActions: IWorkflowActionDefinition[] = [];
	/**
	 * Contains all available actions that can be added into the workflow and their definitions.
	 */
	public allActions$ = new ReplaySubject<IWorkflowActionDefinition[]>();

	/**
	 * Holds a subscription to current selected action in a workflow template version.
	 */
	public selectedAction$ = new ReplaySubject<IWorkflowAction | null>();

	/**
	 * Holds the current selected action.
	 */
	public selectedAction: IWorkflowAction | null = null;

	/**
	 * Observable to show that data in workflow template version has changed.
	 */
	public actionsChanged$ = new Subject<boolean>();

	/**
	 * Holds the original state of all previously selected and current selected workflow action.
	 */
	private actionState = new Map<string, ActionState>;
	/**
	 * Holds all newly added actions.
	 */
	private addedActions: IWorkflowAction[] = [];
	/**
	 * Holds all removed actions.
	 */
	private removedActions: IWorkflowAction[] = [];

	/**
	 * Id of current selected template version.
	 */
	private selectedTemplateVersionId: number = 0;

	private get actionStateId(): string {
		return `${this.selectedTemplateVersionId}-${this.selectedAction?.id}`;
	}

	/**
	 * Initializes workflow action data service
	 */
	public constructor() {
		const options: IDataServiceOptions<IWorkflowActionDefinition> = {
			apiUrl: 'basics/workflow/actions',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			roleInfo: <IDataServiceRoleOptions<IWorkflowActionDefinition>>{
				role: ServiceRole.Root,
				itemName: 'Plant'
			}
		};

		super(options);
		this.loadAllActions();
		this.subscribeToSelectedAction();
	}

	private loadAllActions(): void {
		const identificationData: IIdentificationData = {
			id: 0
		};
		this.provider.load(identificationData).then(actions => {
			const workflowClientActions: WorkflowClientActions = new WorkflowClientActions();
			const clientActions: { [key in WorkflowClientAction]: IClientAction<void> } = workflowClientActions.getClientActions();
			for (const clientAction in clientActions) {
				actions.push((workflowClientActions.getClientActionById(clientAction as WorkflowClientAction) as unknown) as IWorkflowActionDefinition);
			}
			this.allActions = actions;
			this.allActions$.next(actions);
		});
	}

	private subscribeToSelectedAction() {
		this.selectedAction$.subscribe((selectedAction) => {
			this.selectedAction = selectedAction;
			this.setInitialStateOfAction();
		});
	}

	/**
	 * Sets the action into action state map when action is selected for the first time.
	 * @param selectedAction
	 */
	private setInitialStateOfAction() {
		if (this.selectedAction) {
			if (!this.actionState.has(this.actionStateId) || this.actionState.get(this.actionStateId) === undefined) {
				this.actionState.set(this.actionStateId, { originalAction: cloneDeep(this.selectedAction), isChanged: false });
			}
		}
	}

	/**
	 * Check if the value in the field definition has changed.
	 * @param model The model against which the value has to be checked.
	 * @param value The new value of the field.
	 * @returns void
	 */
	public setFieldModified(model: string, value: PropertyType | null | undefined): void {
		if (this.selectedAction) {
			//Check if any change has occured
			const originalActionWithState = this.actionState.get(this.actionStateId);
			if (originalActionWithState) {
				originalActionWithState.isChanged = get(originalActionWithState.originalAction, model) !== value;
				this.actionState.set(this.actionStateId, originalActionWithState);
			}
		}

		this.trackUpdatedTemplateVersion();
	}

	private trackUpdatedTemplateVersion() {
		const actionsInTemplateVersionChanged = [...this.actionState.values()].reduce((acumulator, currentVal) => acumulator || currentVal.isChanged, false) || this.addedActions.length !== 0 || this.removedActions.length !== 0;
		this.updatedTemplateVersions[this.selectedTemplateVersionId] = actionsInTemplateVersionChanged;
	}

	private updatedTemplateVersions: Record<number, boolean> = {};
	public getUpdatedTemplateVersion() {
		return Object.keys(this.updatedTemplateVersions).map(item => parseInt(item)).filter(key => this.updatedTemplateVersions[key]);
	}

	/**
	 * Tracks new action that has been added.
	 * @param workflowAction
	 */
	public trackAddedAction(workflowAction: IWorkflowAction) {
		this.addedActions.push(workflowAction);
		this.trackUpdatedTemplateVersion();
	}

	/**
	 * Tracks new action that has been removed.
	 * @param workflowAction
	 */
	public trackRemovedAction(workflowAction: IWorkflowAction) {
		if (this.addedActions.filter(item => item.id === workflowAction.id).length !== 0) {
			//If removing newly added action, remove from added actions array.
			this.addedActions = this.addedActions.filter(item => item.id === workflowAction.id);
		} else {
			this.removedActions.push(workflowAction);
		}
		this.trackUpdatedTemplateVersion();
	}


	public haveActionsChanged(): void {
		//const actionsChanged = [...this.actionState.values()].reduce((acumulator, currentVal) => acumulator || currentVal.isChanged, false) || this.addedActions.length !== 0 || this.removedActions.length !== 0;
		const actionsChanged = Object.values(this.updatedTemplateVersions).reduce((acumulator, currentval) => acumulator || currentval, false);
		this.actionsChanged$.next(actionsChanged);
	}

	/**
	 * Sets template version id to action service.
	 * @param templateVersionId
	 */
	public setTemplateVersionId(templateVersionId: number) {
		this.selectedTemplateVersionId = templateVersionId;
	}

	/**
	 * Clears the current action state.
	 */
	public clearActionState() {
		this.addedActions = [];
		this.removedActions = [];
		this.actionState.clear();
		this.setInitialStateOfAction();
	}

	/**
	 * Gets specific action based on the action uuid
	 * @param actionId uuid of the action
	 * @returns action definition
	 */
	public getActionById(actionId: string): IWorkflowActionDefinition | undefined {
		return find(this.allActions, {ActionId: actionId});
	}
}
