/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, EventEmitter, inject, Injector, Input, OnChanges, Output, SimpleChanges, StaticProvider, ViewChild, ViewContainerRef } from '@angular/core';
import { ITaskDetailParam } from '../../../model/interfaces/task/task-detail-param.interface';
import { WORKFLOW_ACTION_CONTEXT_TOKEN, WORKFLOW_ACTION_INPUT_TOKEN } from '@libs/workflow/shared';
import { UiSidebarTaskService } from '../../../services/task/task-sidebar.service';
import { PlatformLazyInjectorService } from '@libs/platform/common';
import { IActionParam, ITaskList, TValue, USER_TASK_COMPONENT_SERVICE, WORKFLOW_TASK_POPUP_SERVICE } from '@libs/workflow/interfaces';
import { IMenuItemsList, ItemType } from '@libs/ui/common';


/**
 * Display detail container of selected workflow task.
 */
@Component({
	selector: 'ui-sidebar-task-sidebar-detail',
	templateUrl: './task-sidebar-detail.component.html',
	styleUrls: ['./task-sidebar-detail.component.scss'],
})
export class UiSidebarTaskSidebarDetailComponent implements OnChanges {
	/**
	 * Holds the selected task id and task list.
	 */
	@Input()
	public taskDetail!: ITaskDetailParam;

	/**
	 * Emit the event of back button click to reload the task-sidebar-task.
	 */
	@Output()
	public backButtonClick: EventEmitter<void> = new EventEmitter<void>();

	/**
	 * Renders the task into the detail view.
	 */
	@ViewChild('inlineContainer', {read: ViewContainerRef})
	public viewContainerRef: ViewContainerRef;

	/**
	 * contextData: Contains the information of "Input" and "Context" property of
	 * selected task. The "Input" property data is nothing but json string representation
	 * of user task inputs.
	 *
	 */
	private contextData!: {
		Input: string | IActionParam[];
		Context: string | TValue;
	};

	/**
	 * Holds the current task details.
	 */
	private currentTask: ITaskList | undefined;

	private taskSidebarService = inject(UiSidebarTaskService);

	/**
	 * Indicates position of selected task frm task list.
	 */
	public currentTaskIndex: number = 0;

	/**
	 * Total task count.
	 */
	public totalTasks: number = 0;

	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public toolbarItems: IMenuItemsList = {
		items: [
			{
				caption: { key: 'cloud.desktop.taskList.back' },
				iconClass: 'tlb-icons ico-rec-previous',
				hideItem: false,
				id: 'back',
				sort: 1,
				type: ItemType.Item,
				fn: () =>{
					this.backButtonClick.emit();
				}
			},
			{
				caption: { key: 'cloud.desktop.taskList.refresh' },
				iconClass: 'tlb-icons ico-refresh',
				hideItem: false,
				id: 'refresh',
				sort: 2,
				type: ItemType.Item
			},
			{
				caption: { key: 'cloud.desktop.botChat.previous' },
				iconClass: 'tlb-icons ico-tree-collapse rotate-270',
				hideItem: false,
				id: 'previous',
				sort: 3,
				type: ItemType.Item,
				cssClass: '',
				fn: () => {
					this.loadPreviousTask();
				}
			},
			{
				caption: { key: 'cloud.desktop.botChat.next' },
				iconClass: 'tlb-icons ico-tree-collapse rotate-90',
				hideItem: false,
				id: 'next',
				sort: 5,
				type: ItemType.Item,
				fn: () => {
					this.loadNextTask();
				}
			}
		],
		cssClass: 'tools'
	};


	public constructor(viewContainerRef: ViewContainerRef) {
		this.viewContainerRef = viewContainerRef;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		this.prepareFormConfig(this.taskDetail.selectedId as number);
		this.totalTasks = this.taskDetail.tasks.length;
	}

	/**
	 * Renders the user task html based on "ActionId" of current task
	 * @param selectedId : Current task Id.
	 */
	public async prepareFormConfig(selectedId: number): Promise<void> {
		this.currentTask = this.taskDetail.tasks.find(task => task.Id === selectedId);
		this.currentTaskIndex = this.taskDetail.tasks.findIndex(task => task.Id === selectedId) + 1;
		this.contextData = await this.taskSidebarService.loadContext(selectedId as number);

		if (this.currentTask) {
			this.currentTask.Input = this.contextData.Input as string;
			this.currentTask.Context = this.contextData.Context as string;

			const userTaskComponent = (await this.lazyInjector.inject(USER_TASK_COMPONENT_SERVICE)).getComponentByActionId(this.currentTask.ActionId);
			const providers: StaticProvider[] = [
				{provide: WORKFLOW_ACTION_INPUT_TOKEN, useValue: this.prepareActionInput()},
				{provide: WORKFLOW_ACTION_CONTEXT_TOKEN, useValue: {'isTaskSidebarContainer': true}}
			];
			if (userTaskComponent) {
				this.viewContainerRef.clear();
				this.viewContainerRef.createComponent(userTaskComponent, {injector: Injector.create({providers: providers})});
			}
		}
	}

	/**
	 * Load previous task detail.
	 * @returns
	 */
	public loadPreviousTask(): void {
		if (!this.currentTask) {
			return;
		}
		const currentTaskIndex = this.taskDetail.tasks.findIndex(task => task.Id === this.currentTask!.Id);
		if (currentTaskIndex > 0) {
			const previousTask: ITaskList = this.taskDetail.tasks[currentTaskIndex - 1];
			this.prepareFormConfig(previousTask.Id);
		}
	}

	/**
	 * Load next task detail.
	 * @returns
	 */
	public loadNextTask(): void {
		if (!this.currentTask) {
			return;
		}
		const currentTaskIndex = this.taskDetail.tasks.findIndex(task => task.Id === this.currentTask!.Id);
		if (currentTaskIndex < (this.taskDetail.tasks.length - 1)) {
			const nextTask: ITaskList = this.taskDetail.tasks[currentTaskIndex + 1];
			this.prepareFormConfig(nextTask.Id);
		}
	}

	/**
	 *Converts the JSON string value of "Input" property from contextData
	 * into type specific Action Input parameter.
	 * This is because, each user-task component takes input in the form of
	 * IActionParam to generate form rows.
	 * @returns Action input parameters.
	 */
	private prepareActionInput(): IActionParam[] {
		let actionInputDetail: IActionParam[];
		if (this.contextData.Input && typeof (this.contextData.Input === 'string')) {
			actionInputDetail = JSON.parse(this.contextData.Input as string) as IActionParam[];
			return actionInputDetail;
		} else {
			actionInputDetail = this.contextData.Input as IActionParam[];
		}
		return actionInputDetail;
	}

	/**
	 * Displays the form-config into dialog on click of Expand button.
	 */
	public async showDialog(): Promise<void> {
		if (this.currentTask && this.contextData) {
			const taskPopupService = await this.lazyInjector.inject(WORKFLOW_TASK_POPUP_SERVICE);
			taskPopupService.openPopup(this.currentTask);
		}
	}
}