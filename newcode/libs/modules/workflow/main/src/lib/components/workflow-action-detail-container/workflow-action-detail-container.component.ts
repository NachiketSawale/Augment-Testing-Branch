/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, OnDestroy, inject } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { Subscription } from 'rxjs';
import { IWorkflowParameter } from '@libs/workflow/shared';
import { IWorkflowAction, IWorkflowActionDefinition, WorkflowActionType } from '@libs/workflow/interfaces';
import { CodemirrorLanguageModes, ICodemirrorEditorOptions } from '@libs/ui/common';
import { WorkflowActionDetailEnumStandard, WorkflowActionDetailEnumStartEnd, WorkflowActionDetailEnumDecision, WorkflowActionDetailEnumDecisionNode } from '../../model/enum/workflow-action-detail.enum';
import { BasicsWorkflowActionDataService } from '../../services/workflow-action/workflow-action.service';
import * as _ from 'lodash';
import { WorkflowDesignerActions } from '../../constants/workflow-designer-actions.class';
import { IDesignerActionIcon } from '../../model/workflow-designer-action-icon.interface';


/**
 * To load the fields for selected action.
 */
@Component({
	selector: 'workflow-main-action-detail-container',
	templateUrl: './workflow-action-detail-container.component.html',
	styleUrls: ['./workflow-action-detail-container.component.scss'],
})
export class WorkflowActionDetailContainerComponent extends ContainerBaseComponent implements OnDestroy {

	/**
	 * parameters for a selected action.
	 */
	public actionDetailParams: IWorkflowParameter[] = [];
	public selectedAction!: IWorkflowAction;

	private actionsList: IWorkflowActionDefinition[] = [];
	private actionTypeFactory = new WorkflowDesignerActions;
	private selectedAction$: Subscription;
	private result$?: Subscription;
	private readonly actionService: BasicsWorkflowActionDataService = inject(BasicsWorkflowActionDataService);

	/**
	 * Initializes component with ui addons, container definition and workflow action data service
	 */
	public constructor() {
		super();
		this.actionService.allActions$.subscribe((actions) => {
			this.actionsList = actions as IWorkflowActionDefinition[];
		});
		this.selectedAction$ = this.actionService.selectedAction$.subscribe((action) => {
			const detailParams: IWorkflowParameter[] = [];
			if (action !== null && action !== undefined) {
				this.selectedAction = action;
				let actionTypeEnum: string[];
				switch (action.actionTypeId) {
					case 1:
					case 2:
						//ActionDetailType 1 now WorkflowActionDetailEnumStartEnd
						// Code, Description, Comment, Result
						actionTypeEnum = this.getActionDetailEnumValues(WorkflowActionDetailEnumStartEnd);
						break;
					case 3:
					case 6:
						//ActionDetailType 3 now WorkflowActionDetailEnumDecision
						// actionType, action, code, description, comment, executeCondition, result, userDefined1-5, userDefinedMoney1-5, userDefinedDate1-5, lifeTime, endTime, bpId, radioList.editorMode.clerkLookUp, radioList.editorModePrio
						actionTypeEnum = this.getActionDetailEnumValues(WorkflowActionDetailEnumDecision);
						break;
					case 4:
					case 5:
					case 7:
					case 8:
					case 9:
					case 10:
						//ActionDetailType 0 now WorkflowActionDetailEnumStandard
						// actionType, action, code, description, comment, executeCondition, result, userDefined1-5, userDefinedMoney1-5, userDefinedDate1-5, lifeTime
						actionTypeEnum = this.getActionDetailEnumValues(WorkflowActionDetailEnumStandard);
						break;
					default:
						//ActionDetailType 2 now WorkflowActionDetailEnumDecisionNode
						//parameter, description, comment, result, userDefined1-5, userDefinedMoney1-5, userDefinedDate1-5
						actionTypeEnum = this.getActionDetailEnumValues(WorkflowActionDetailEnumDecisionNode);
						break;
				}

				const actionPrototyp: IWorkflowActionDefinition = _.find(this.actionsList, { Id: action.actionId }) as IWorkflowActionDefinition;
				const actionTypeMapping: IDesignerActionIcon = actionPrototyp ? this.actionTypeFactory.actionTypeArray[(actionPrototyp as IWorkflowActionDefinition).ActionType as WorkflowActionType] : {} as IDesignerActionIcon;
				actionTypeEnum.forEach((key, index) => {
					let actionType: string = '';
					const codeMirrorObject: ICodemirrorEditorOptions = { readOnly: false, multiline: false, languageMode: CodemirrorLanguageModes.JavaScript, enableLineNumbers: false, enableBorder: true };
					switch (key) {
						case WorkflowActionDetailEnumStandard.actionType:
							actionType = actionTypeMapping.description ?
								actionTypeMapping.description : '';
							this.selectedAction.actionType = actionType;
							codeMirrorObject.readOnly = true;
							codeMirrorObject.enableBorder = false;
							break;
						case WorkflowActionDetailEnumStandard.action:
							actionType = actionPrototyp ? actionPrototyp.Description : '';
							this.selectedAction.action = actionType;
							codeMirrorObject.readOnly = true;
							codeMirrorObject.enableBorder = false;
							break;
						case WorkflowActionDetailEnumStandard.executeCondition:
							actionType = action[key] ? action[key] : '';
							codeMirrorObject.multiline = true;
							break;
						default:
							if (action[key] !== undefined) {
								const actionValue = action[key];
								// actionValue !== null is needed even if it said it is not needed
								if (actionValue !== undefined && actionValue !== null) {
									actionType = actionValue.toString();
								}
							}
					}

					const param: IWorkflowParameter = {
						id: index,
						key: key,
						value: actionType,
						editorOptions: codeMirrorObject,
						label: { key: 'basics.workflow.action.detail.' + key }
					};
					detailParams.push(param);
				});
			}
			this.actionDetailParams = detailParams;
		});
	}

	private getActionDetailEnumValues(workflowEnum: object): string[] {
		return Object.keys(workflowEnum).filter((v) => isNaN(Number(v)));
	}
	/**
	 * This method is invoked once the component is destroyed. All subscriptions are cleaned in this method.
	 */
	public override ngOnDestroy(): void {
		// unsubscribing to selected action subject from action data service
		this.selectedAction$.unsubscribe();
		this.result$?.unsubscribe();

		super.ngOnDestroy();
	}
}