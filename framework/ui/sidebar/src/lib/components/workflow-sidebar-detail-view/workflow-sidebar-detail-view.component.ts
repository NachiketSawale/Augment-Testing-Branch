import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { IAccordionItem, UiCommonModule } from '@libs/ui/common';
import { IWorkflowInstance, IWorkflowInstanceService, IWorkflowSidebarService, WORKFLOW_INSTANCE_SERVICE, WORKFLOW_SIDEBAR_SERVICE, WorkflowSidebarSwitch } from '@libs/workflow/interfaces';
import { IIdentificationData, ITranslatable, PlatformCommonModule, PlatformLazyInjectorService } from '@libs/platform/common';
import { IWorkflowDetailStatusInfo } from '../../model/interfaces/sidebar/workflow-sidebar-detail-status.interface';

@Component({
	selector: 'ui-sidebar-workflow-detail-view',
	standalone: true,
	imports: [
		NgIf,
		UiCommonModule,
		PlatformCommonModule,
		NgForOf
	],
	templateUrl: './workflow-sidebar-detail-view.component.html',
	styleUrl: './workflow-sidebar-detail-view.component.css'
})
export class WorkflowSidebarDetailViewComponent implements OnInit, OnDestroy {

	/**
	 * Selected workflow
	 */
	@Input()
	public item!: IAccordionItem;

	/**
	 * Workflow sidebar service
	 */
	public workflowSidebarService!: IWorkflowSidebarService;

	/**
	 * Number of workflow templates in workflow sidebar
	 */
	public workflowItemCount: number = 0;

	/**
	 * Enum for the menu switch case
	 */
	public readonly workflowSidebarSwitch = WorkflowSidebarSwitch;

	/**
	 * Set the loading screen when starting a workflow
	 */
	public loadingScreen: boolean = false;

	/**
	 * Display the loading text
	 */
	public loadingText: ITranslatable = {key: 'cloud.desktop.taskList.loadingInfo'};

	public workflowStatus: IWorkflowDetailStatusInfo[] = [];

	private selectedWorkflowListIndex: number = 0;
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private workflowInstanceService!: IWorkflowInstanceService;


	public async ngOnInit(): Promise<void> {
		this.workflowSidebarService = await this.lazyInjector.inject(WORKFLOW_SIDEBAR_SERVICE);
		this.workflowInstanceService = await this.lazyInjector.inject(WORKFLOW_INSTANCE_SERVICE);
		this.workflowItemCount = this.workflowSidebarService.getWorkflowItemList.length;
	}

	public ngOnDestroy() {
		this.workflowSidebarService.setCaseForView(this.workflowSidebarSwitch.DefaultView);
	}

	/**
	 * Get the item list position of the selected workflow item
	 */
	public getSelectedWorkflowListPosition(): number {
		if (this.item) {
			this.selectedWorkflowListIndex = this.workflowSidebarService.getWorkflowItemList.findIndex(items => items.id === this.item?.id);
		}
		return this.selectedWorkflowListIndex + 1;
	}

	/**
	 * Load the previous workflow in the workflow item list if the current selection is not the first workflow
	 */
	public loadPreviousWorkflow() {
		if (this.selectedWorkflowListIndex > 0) {
			this.item = this.workflowSidebarService.getWorkflowItemList[this.selectedWorkflowListIndex - 1];
			this.workflowStatus = [];
		}
	}

	/**
	 * Load the next workflow in the workflow item list if the current selection is not the last workflow
	 */
	public loadNextWorkflow() {
		if ((this.workflowSidebarService.getWorkflowItemList.length - 1) > this.selectedWorkflowListIndex) {
			this.item = this.workflowSidebarService.getWorkflowItemList[this.selectedWorkflowListIndex + 1];
			this.workflowStatus = [];
		}
	}

	/**
	 * Starts selected workflow
	 */
	public async startWorkflow() {
		this.loading(true);
		const response = await this.workflowInstanceService.startWorkflow(this.item.id as number);
		this.workflowStatus = this.workflowStatusInfo(response);
		this.loading(false);
	}

	/**
	Starts selected workflow for every entity
	 */
	public async startWorkflowForEveryEntity() {
		const allEntitiesId: IIdentificationData[] = this.workflowSidebarService.getAllEntityIds();
		if (allEntitiesId.length > 0) {
			this.loading(true);
			const response = await this.workflowInstanceService.startWorkflowBulk(this.item.id as number, allEntitiesId.splice(0, 10), '');
			this.workflowStatus = this.workflowStatusInfo(response);
			this.loading(false);
		}
	}

	/**
	 * Starts selected workflow for all selected entities
	 */
	public async startWorkflowAllSelectedEntities() {
		const allSelectedEntitiesId: IIdentificationData[] = this.workflowSidebarService.getSelectedEntityIds();
		if (allSelectedEntitiesId.length > 0) {
			this.loading(true);
			const response = await this.workflowInstanceService.startWorkflowBulk(this.item.id as number, allSelectedEntitiesId, '');
			this.workflowStatus = this.workflowStatusInfo(response);
			this.loading(false);
		}
	}

	public workflowStatusInfo(response?: IWorkflowInstance): IWorkflowDetailStatusInfo[] {
		return [
			//Workflow description
			{
				text: {key: 'cloud.desktop.taskList.workflowDescription', params: {p_0: response?.Description ?? ''}}
			},
			//Workflow status
			{
				text: {key: 'cloud.desktop.taskList.workflowStatus', params: {p_0: response?.StatusName ?? ''}}
			},
			//Workflow error
			{
				text: {key: 'cloud.desktop.taskList.workflowError', params: {p_0: response?.ErrorMessage ?? ''}}
			},
			...this.workflowHistoryInfo(response)
		];
	}

	private workflowHistoryInfo(response?: IWorkflowInstance): IWorkflowDetailStatusInfo[] {
		const info: IWorkflowDetailStatusInfo[] = [{text: {key: 'cloud.desktop.taskList.workflowHistory'}}];
		response?.ActionInstances.forEach(action => {
			const infoText: IWorkflowDetailStatusInfo = {text: action.Description};
			if (!action.IsRunning) {
				infoText.iconCss = 'control-icons ico-tick';
			} else {
				infoText.iconCss = 'spinner-sm fa-spin';
			}
			info.push(infoText);
		});
		return info;

	}

	private loading(show: boolean): void {
		this.loadingScreen = show;
		if (show) {
			this.loadingText.params = {p_0: this.item.title};
		}
	}
}