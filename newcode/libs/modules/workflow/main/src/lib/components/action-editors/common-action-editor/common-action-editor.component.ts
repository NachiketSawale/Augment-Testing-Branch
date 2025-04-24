/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Inject, Injector, inject, effect, ChangeDetectorRef } from '@angular/core';
import { IFormConfig } from '@libs/ui/common';
import { WorkflowActionEditorRegistryService } from '../../../services/workflow-action-editor-registry/workflow-action-editor-registry.service';
import { IContainerUiAddOns } from '@libs/ui/container-system';
import { PARAMETERS_TOKEN, UI_ADDON_TOKEN } from '../../../constants/workflow-action-editor-id';
import { BasicsWorkflowActionDataService } from '../../../services/workflow-action/workflow-action.service';
import { ActionEditorHelper } from '../../../model/classes/common-action-editors/action-editor-helper.class';
import { ParameterType } from '../../../model/enum/action-editors/parameter-type.enum';
import { IWorkflowAction } from '@libs/workflow/interfaces';

/**
 * Action editor component that will render form based action editors.
 */
@Component({
	selector: 'workflow-main-sql-action-editor',
	templateUrl: './common-action-editor.component.html',
	styleUrls: ['./common-action-editor.component.scss'],
})
export class CommonActionEditorComponent {
	public formConfig: IFormConfig<IWorkflowAction> | undefined;
	private readonly injector: Injector = inject(Injector);
	private readonly detector = inject(ChangeDetectorRef);

	public constructor(@Inject(PARAMETERS_TOKEN) public workflowAction: IWorkflowAction, workflowActionEditorRegistry: WorkflowActionEditorRegistryService, @Inject(UI_ADDON_TOKEN) uiAddons: IContainerUiAddOns, workflowActionService: BasicsWorkflowActionDataService) {
		if (workflowAction.actionId) {
			//Get common
			const actionEditorConfiguration = new (workflowActionEditorRegistry.getCommonActionEditorFormConfig(workflowAction.actionId))(workflowAction, workflowActionService, this.injector);

			//Build form configuration
			this.formConfig = actionEditorConfiguration.getFormConfig();

			effect(() => {
				if (actionEditorConfiguration.$config) {
					this.formConfig = {rows: []} as IFormConfig<IWorkflowAction>;
					//Force change detection after reset the config to refresh the view
					this.detector.detectChanges();
					this.formConfig = actionEditorConfiguration.$config();

					//Adding custom save logic whenever form changes
					this.formConfig.rows.forEach((row) => {
						if (!row.change) {
							row.change = (changeInfo) => {
								let rowModel = '';
								if (!row.model && typeof row.model === 'string') {
									rowModel = row.model;
								} else {
									rowModel = ActionEditorHelper.setModelProperty(workflowAction, row.id, row.groupId as ParameterType);
								}
								workflowActionService.setFieldModified(rowModel, changeInfo.newValue);
							};
						}
					});
				}
			});

			//Build toolbar items
			if (actionEditorConfiguration.getToolbarItems) {
				uiAddons.toolbar.addItems(actionEditorConfiguration.getToolbarItems());
			}

			//Adds default values to the action parameters
			if (actionEditorConfiguration.setDefaultValues) {
				actionEditorConfiguration.setDefaultValues();
			}
		}
	}
}