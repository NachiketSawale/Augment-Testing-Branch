import { AfterViewInit, Component, inject, Injector, OnDestroy, ViewContainerRef } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { BasicsWorkflowInstanceDataService } from '../../services/basics-workflow-instance-data.service';
import { IScriptEditorOptions, IScriptControlContext, ScriptComponent } from '@libs/ui/common';
import { CodemirrorLanguageModes, ControlContextInjectionToken } from '@libs/ui/common';

@Component({
	selector: 'workflow-admin-itwo40-workflow-instance-context',
	templateUrl: './workflow-instance-context.component.html',
	styleUrls: ['./workflow-instance-context.component.scss'],
})
export class WorkflowInstanceContextComponent extends ContainerBaseComponent implements OnDestroy, AfterViewInit {
	private instanceDataService = inject(BasicsWorkflowInstanceDataService);
	private viewContainerRef = inject(ViewContainerRef);
	public config: IScriptEditorOptions | undefined;
	/**
	 * Contains the context json as object
	 */
	public displayContext: string = '';

	/**
	 * Initialize graph data after view is rendered
	 */
	public ngAfterViewInit(): void {
		//this.loadContextData();
		this.instanceDataService.selectionChanged$.subscribe((actionInstance) => {
			//this.displayContext = JSON.stringify(JSON.parse(actionInstance[0].Context),null,2);
			this.displayContext = actionInstance[0].Context;
			const scriptControlContext: IScriptControlContext = {
				editorOptions: {languageMode: CodemirrorLanguageModes.Json, multiline: true, readOnly: true, enableLineNumbers: true},
				value: this.displayContext,
				entityContext: {totalCount: 0},
				fieldId: '1',
				readonly: false,
				validationResults: []
			};
			this.viewContainerRef.clear();
			this.viewContainerRef.createComponent(ScriptComponent, {injector: Injector.create({providers: [{provide: ControlContextInjectionToken, useValue: scriptControlContext}]})});
		});
	}

	public constructor() {
		super();
	}

	/*private loadContextData() {
		this.instanceDataService.selectionChanged$.subscribe((actionInstance) => {
			//this.displayContext = JSON.stringify(JSON.parse(actionInstance[0].Context),null,2);
			//this.displayContext = actionInstance[0].Context;
		});
	}*/
}