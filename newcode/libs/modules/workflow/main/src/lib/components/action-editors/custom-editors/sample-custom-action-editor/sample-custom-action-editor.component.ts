/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, Inject, ViewContainerRef } from '@angular/core';
import { IContainerUiAddOns } from '@libs/ui/container-system';
import { IWorkflowAction } from '@libs/workflow/interfaces';
import { PARAMETERS_TOKEN, UI_ADDON_TOKEN } from '../../../../constants/workflow-action-editor-id';

@Component({
	selector: 'workflow-main-sample-custom-action-editor',
	templateUrl: './sample-custom-action-editor.component.html',
	styleUrls: ['./sample-custom-action-editor.component.scss'],
})
export class SampleActionEditorComponent {
	public editorValue = 'test';
	public constructor(private viewContainerRef: ViewContainerRef, @Inject(UI_ADDON_TOKEN) uiAddons: IContainerUiAddOns, @Inject(PARAMETERS_TOKEN) workflowAction: IWorkflowAction) {
		// const scriptControlContext: IScriptControlContext = {
		// 	editorOptions: { languageMode: CodemirrorLanguageModes.Html, multiline: true, readOnly: false },
		// 	value: this.editorValue,
		// 	entityContext: {totalCount: 0},
		// 	fieldId: '',
		// 	readonly: false,
		// 	validationResults: []
		// };
		// this.viewContainerRef.createComponent(ScriptComponent, { injector: Injector.create({ providers: [{ provide: ControlContextInjectionToken, useValue: scriptControlContext }] }) });

		//Add toolbar items
		//uiAddons.toolbar.addItems();
	}

}