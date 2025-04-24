/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowInputParametersContainerComponent } from './components/workflow-input-parameters-container/workflow-input-parameters-container.component';
import { DisplayParametersComponent } from './components/display-parameters/display-parameters.component';
import { WorkflowOutputParametersContainerComponent } from './components/workflow-output-parameters-container/workflow-output-parameters-container.component';
import { WorkflowDesignerComponent } from './components/workflow-designer-container/workflow-designer-container.component';
import { WorkflowTemplateContainerComponent } from './components/workflow-template-container/workflow-template-container.component';
import { WorkflowSvgDirective } from './directive/workflow-designer/workflow-designer-svg.directive';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { FormsModule } from '@angular/forms';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { ContainerModuleRoute } from '@libs/ui/container-system';
import { WorkflowMainModuleInfo } from './model/workflow-main-module-info.class';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowActionAlignTextDirective } from './directive/workflow-designer/workflow-action-align-text.directive';
import { WorkflowDesignerEventListenerDirective } from './directive/workflow-designer/workflow-designer-event-listener.directive';
import { WorkflowDebugContainerComponent } from './components/workflow-debug-container/workflow-debug-container.component';
import { WorkflowActionDetailContainerComponent } from './components/workflow-action-detail-container/workflow-action-detail-container.component';
import { CommonActionEditorComponent } from './components/action-editors/common-action-editor/common-action-editor.component';
import { WorkflowEntityService } from './services/workflow-entity/workflow-entity.service';
import { UserInputActionEditorComponent } from './components/action-editors/custom-editors/user-input-action-editor/user-input-action-editor.component';
import { ParameterGridViewComponent } from './components/action-editors/standard-view-components/parameter-grid-view/parameter-grid-view.component';
import { ParameterViewModeComponent } from './components/action-editors/parameter-view-mode/parameter-view-mode.component';
import { PlatformCommonModule } from '@libs/platform/common';
import { WorflowEntityStatusService } from './services/workflow-data-services/workflow-entity-status-lookup-data.service';
import { ExpandableDomainControlParentComponent } from './components/action-editors/expandable-domain-control-parent/expandable-domain-control-parent.component';
import { ExpandableDomainControlItemComponent } from './components/action-editors/expandable-domain-control-item/expandable-domain-control-item.component';
import { WorkflowSubscribedEventService } from './services/workflow-subscribed-event/workflow-subscribed-event.service';
import { WorkflowUserformActionComponent } from './components/workflow-client-actions/workflow-userform-action/workflow-userform-action.component';
import { WorkflowExtendedActionContainerComponent } from './components/workflow-extended-action-container/workflow-extended-action-container.component';
import { WorkflowActionParametersComponent } from './components/workflow-action-parameters/workflow-action-parameters.component';
import { WorkflowAdvanceTypesComponent } from './components/workflow-client-actions/workflow-advance-types/workflow-advance-types.component';
import { WorkflowUserInputActionComponent } from './components/workflow-client-actions/user-input-action/user-input-action.component';

/**
 * Adds a default route to render containers to workflow main module
 */
const routes: Routes = [new ContainerModuleRoute(WorkflowMainModuleInfo.instance)];

/**
 * Workflow main module
 */
@NgModule({
	imports: [CommonModule, NgxGraphModule, FormsModule, GridComponent, UiCommonModule, RouterModule.forChild(routes), PlatformCommonModule],

	declarations: [
		WorkflowInputParametersContainerComponent,
		DisplayParametersComponent,
		WorkflowOutputParametersContainerComponent,
		WorkflowSvgDirective,
		WorkflowTemplateContainerComponent,
		WorkflowDesignerComponent,
		WorkflowActionAlignTextDirective,
		WorkflowDesignerEventListenerDirective,
		WorkflowDebugContainerComponent,
		WorkflowActionDetailContainerComponent,
		CommonActionEditorComponent,
		UserInputActionEditorComponent,
		ParameterViewModeComponent,
		ParameterGridViewComponent,
		WorkflowAdvanceTypesComponent,
		ExpandableDomainControlParentComponent,
		ExpandableDomainControlItemComponent,
		WorkflowUserformActionComponent,
		WorkflowExtendedActionContainerComponent,
		WorkflowActionParametersComponent,
		WorkflowUserInputActionComponent
	]
})
export class WorkflowMainModule {
	private readonly workflowEntityService = inject(WorkflowEntityService);
	private readonly worflowEntityStatusService = inject(WorflowEntityStatusService);
	private readonly workflowSubscribedEventService = inject(WorkflowSubscribedEventService);

	/**
	 *	Loads pre-requisites for the workflow main module.
	 */
	public constructor() {
		this.workflowEntityService.loadAllEntityFacades();
		this.worflowEntityStatusService.loadEntityStatus();
		this.workflowSubscribedEventService.loadSubscribedEventsForLookup();
	}
}
