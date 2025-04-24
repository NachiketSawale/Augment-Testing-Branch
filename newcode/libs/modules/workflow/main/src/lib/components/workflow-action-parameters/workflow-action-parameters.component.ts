/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Injector, StaticProvider, Type, ViewContainerRef, inject } from '@angular/core';
import { WorkflowActionEditorRegistryService } from '../../services/workflow-action-editor-registry/workflow-action-editor-registry.service';
import { BasicsWorkflowActionDataService } from '../../services/workflow-action/workflow-action.service';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { Subscription } from 'rxjs';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { ActionEditor, PARAMETERS_TOKEN, UI_ADDON_TOKEN } from '../../constants/workflow-action-editor-id';

@Component({
	selector: 'workflow-main-workflow-action-parameters',
	templateUrl: './workflow-action-parameters.component.html',
	styleUrls: ['./workflow-action-parameters.component.scss'],
})
export class WorkflowActionParametersComponent extends ContainerBaseComponent {

	private readonly workflowActionEditorRegistryService = inject(WorkflowActionEditorRegistryService);
	private readonly actionService = inject(BasicsWorkflowActionDataService);
	private subscriptions: Subscription[] = [];
	private selectedAction: IWorkflowAction | null = null;

	public constructor(private viewContainerRef: ViewContainerRef) {
		super();
		this.loadActions();
	}

	private loadActionContainer(guid: string | null) {
		this.viewContainerRef.clear();
		this.uiAddOns.toolbar.clear();
		if(guid) {

			const actionEditor: Type<ActionEditor> | undefined = this.workflowActionEditorRegistryService.getActionEditorType(guid);

			const providers: StaticProvider[] = [
				{ provide: UI_ADDON_TOKEN, useValue: this.uiAddOns },
				{ provide: PARAMETERS_TOKEN, useValue: this.selectedAction},
			];

			if(actionEditor) {
				this.viewContainerRef.createComponent(actionEditor, { injector: Injector.create({ providers: providers }) });
			}
		}
	}

	private loadActions() {
		const selectedAction$ = this.actionService.selectedAction$.subscribe((action: IWorkflowAction | null) => {
			let guid: string | null = null;

			if (action && action.actionId != undefined) {
				guid = action.actionId;
				this.selectedAction = action;
			}

			this.loadActionContainer(guid);
		});

		this.subscriptions.push(selectedAction$);
	}
}
