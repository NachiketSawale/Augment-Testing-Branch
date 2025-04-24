import { AfterViewInit, Component, inject, Injector, OnDestroy, ViewContainerRef } from '@angular/core';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { BasicsWorkflowActionInstanceDataService } from '../../services/basics-workflow-action-instance-data.service';
import { CodemirrorLanguageModes, ControlContextInjectionToken, IScriptControlContext, ScriptComponent } from '@libs/ui/common';
import {Subscription} from 'rxjs';
import * as _ from 'lodash';

/**
 * Container to show action instance context.
 */
@Component({
	selector: 'workflow-admin-itwo40-workflow-action-instance-context',
	templateUrl: './workflow-action-instance-context.component.html',
	styleUrls: ['./workflow-action-instance-context.component.scss'],
})

export class WorkflowActionInstanceContextComponent extends ContainerBaseComponent implements OnDestroy, AfterViewInit {
	private instanceDataService = inject(BasicsWorkflowActionInstanceDataService);
	private viewContainerRef = inject(ViewContainerRef);
	private subscriptionContent$!: Subscription;

	/**
	 * Initialize graph data after view is rendered.
	 */
	public ngAfterViewInit(): void {
		this.subscriptionContent$ = this.instanceDataService.selectionChanged$.subscribe((actionInstance) => {
			if(!_.isEmpty(actionInstance)){
				const scriptControlContext: IScriptControlContext = {
					editorOptions: {languageMode: CodemirrorLanguageModes.Json, multiline: true, readOnly: true, enableLineNumbers: true},
					value: actionInstance[0].Context,
					entityContext: {totalCount: 0},
					fieldId: '1',
					readonly: false,
					validationResults: []
				};
				this.viewContainerRef.clear();
				this.viewContainerRef.createComponent(ScriptComponent, {injector: Injector.create({providers: [{provide: ControlContextInjectionToken, useValue: scriptControlContext}]})});
			}
		});

	}

	public constructor() {
		super();
	}

	/**
	 * Unsubscribes when view is not rendered.
	 */
	public override ngOnDestroy() {
		this.subscriptionContent$.unsubscribe();
		super.ngOnDestroy();
	}

}