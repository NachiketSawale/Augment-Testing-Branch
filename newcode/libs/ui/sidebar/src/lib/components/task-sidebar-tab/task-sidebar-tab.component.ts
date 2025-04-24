/**
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UiSidebarTaskService } from '../../services/task/task-sidebar.service';
import {
	ConcreteMenuItem,
	createLookup,
	FieldType,
	IAccordionItem,
	ICustomDialogOptions,
	IDropdownBtnMenuItem,
	IFormConfig,
	IMenuItemsList,
	ItemType,
	IYesNoDialogOptions,
	StandardDialogButtonId,
	UiCommonDialogService,
	UiCommonMessageBoxService
} from '@libs/ui/common';
import { UiSidebarTaskGroupingLookupService } from '../../services/task/task-sidebar-grouping-lookup.service';
import { UiSidebarTaskSortingLookupService } from '../../services/task/task-sidebar-sorting-lookup.service';
import { UiSidebarTaskFilterLookupService } from '../../services/task/task-sidebar-filter-lookup.service';
import { TaskSidebarSaveDialogComponent } from './task-sidebar-save-dialog/task-sidebar-save-dialog.component';
import { ITaskDetailParam } from '../../model/interfaces/task/task-detail-param.interface';
import { PlatformLazyInjectorService, Translatable } from '@libs/platform/common';
import { ITaskListFilterDefinition, ITaskList, ITaskListFilterOptions, ITaskSidebarTabService, IWorkflowSidebarTask, TASK_SIDEBAR_TAB_SERVICE, WORKFLOW_TASK_SIDEBAR_TOKEN, WorkflowInterval } from '@libs/workflow/interfaces';
import { interval, Subscription, tap } from 'rxjs';
import { UiSidebarService } from '../../services/sidebar.service';
import { addMinutes } from 'date-fns';


/**
 * Implements the basic functionality for task sidebar.
 */
@Component({
	selector: 'ui-sidebar-task-sidebar-tab',
	templateUrl: './task-sidebar-tab.component.html',
	styleUrls: ['./task-sidebar-tab.component.scss'],
})
export class UiSidebarTaskSidebarTabComponent implements OnInit, OnDestroy {

	public readonly groupingLookupService = inject(UiSidebarTaskGroupingLookupService);
	public readonly sortingLookupService = inject(UiSidebarTaskSortingLookupService);
	public readonly filterLookupService = inject(UiSidebarTaskFilterLookupService);

	private readonly taskSidebarService = inject(UiSidebarTaskService);
	private readonly customDialogService = inject(UiCommonDialogService);

	private filterOptions: ITaskListFilterOptions = {
		grouping: '',
		sorting: '',
		sortingAscending: false,
		filterDefinitionName: '',
		mainEntityFiltered: false,
		taskListIsLoaded: false,
		useFilterDefinitions: false
	};
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private workflowMainTaskSidebarService!: IWorkflowSidebarTask;

	private readonly sidebarService = inject(UiSidebarService);

	public sidebarPinService!: ITaskSidebarTabService;
	private dialogOptions: ICustomDialogOptions<StandardDialogButtonId, TaskSidebarSaveDialogComponent> = {
		bodyComponent: TaskSidebarSaveDialogComponent,
		headerText: 'Save setting: Please enter location and setting name.',
		buttons: [
			{
				autoClose: false,
				caption: {key: 'cloud.desktop.filterdefFooterBtnSave'},
				isDisabled: (info) => {
					return info.dialog.body.CheckOkIsDisabled();
				},
				id: StandardDialogButtonId.Ok,
				fn: (event, info) => {
					this.workflowMainTaskSidebarService.prepareSaveDefinitionAs(info.dialog.body.dialogValues);
					info.dialog.close();
				}
			},
			{
				id: StandardDialogButtonId.Cancel,
				caption: {key: 'cloud.desktop.filterdefSaveCancelBnt'}
			}
		],
	};

	public sortingAscending = false;
	public groupingToggle: boolean = false;
	public newTaskList: ITaskList[] = [];
	public toolbarData: IMenuItemsList<IDropdownBtnMenuItem> = {};
	public accordionData: IAccordionItem[] = [];
	public showTaskDetail: boolean = false;
	public taskContext!: ITaskDetailParam;
	public isFilterDisable: boolean = false;

	/**
	 * Toolbar data for header
	 */
	public readonly toolbarItems: IMenuItemsList = {
		items: [
			{
				caption: {key: 'cloud.desktop.taskList.mainEntityFilter'},
				iconClass: 'tlb-icons ico-filter',
				type: ItemType.Item,
				fn: () => {
					//TODO after implementing interface
				}
			},
			{
				caption: {key: 'cloud.desktop.taskList.clear'},
				iconClass: 'tlb-icons ico-discard',
				type: ItemType.Item,
				fn: async () => {
					await this.clearNotifications();
				}
			},
			{
				caption: {key: 'cloud.desktop.taskList.refresh'},
				iconClass: 'tlb-icons ico-refresh',
				type: ItemType.Item,
				fn: () => {
					this.workflowMainTaskSidebarService.loadWorkflowTasks();
				}
			},
			{
				caption: {key: 'cloud.desktop.taskList.showFilter'},
				iconClass: 'tlb-icons ico-search',
				type: ItemType.Item,
				fn: () => {
					this.toggleSearch();
				}
			},
			{
				caption: {key: 'cloud.desktop.taskList.groupOrSortingSetting'},
				iconClass: 'tlb-icons ico-settings',
				type: ItemType.Item,
				fn: () => {
					this.toggleGroupingSettings();
				}
			},
			{
				caption: {key: 'cloud.desktop.taskList.maximize'},
				iconClass: 'tlb-icons ico-sdb-maximize',
				type: ItemType.Item,
				fn: () => {
					this.toggleMaximize();
				}
			}
		],
		cssClass: 'tools'
	};

	public readonly formConfig: IFormConfig<object> = {
		formId: 'groupSortingSetting',
		rows: [
			{
				id: 'useFilterDefinitions',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataService: this.filterLookupService,
				}),
				change: () => {
					this.useFilterDefinitions();
				},
				model: 'filterDefinitionName'

			},
			{
				id: 'groupTaskList',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataService: this.groupingLookupService
				}),
				change: () => {
					this.groupTaskList();
				},
				model: 'grouping'
			},
			{
				id: 'sortTaskList',
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataService: this.sortingLookupService
				}),
				change: changeInfo => {
					this.workflowMainTaskSidebarService.sortTaskList(changeInfo.newValue as boolean);
				},
				model: 'sorting'
			},
			{
				id: 'radio',
				type: FieldType.Radio,
				model: 'radio',
				itemsSource:{
					items: [
						{
							id: 0,
							displayName: 'cloud.desktop.taskList.sortAscending'
						},
						{
							id: 1,
							displayName: 'cloud.desktop.taskList.sortDescending'
						}
					]
				},
				//newValue equals to one of the radio item ids. Depends on the selected button
				change: changeInfo => {
					this.workflowMainTaskSidebarService.sortTaskList(!changeInfo.newValue);
				}
			}
		]
	};

	private filterDefinitions: ITaskListFilterDefinition[] = [];
	private subscriptions: Subscription[] = [];

	public searchToggle: boolean = false;

	/**
	 * initializes the data for the taskList
	 */
	public async ngOnInit() {
		this.workflowMainTaskSidebarService = await this.lazyInjector.inject(WORKFLOW_TASK_SIDEBAR_TOKEN);
		await this.workflowMainTaskSidebarService.loadWorkflowTasks();
		this.prepareToolbar();
		this.initializeTasks();
	}

	private async initializeTasks() {
		//Load filter definitions
		await this.getFilterDefinitions();

		const task$ = this.workflowMainTaskSidebarService.WorkflowSidebarTasks$.subscribe(tasks => {
			this.formatTaskList(tasks);
			this.useFilterDefinitions();
			this.prepareTasks();
		});

		await this.workflowMainTaskSidebarService.loadWorkflowTaskCount();
		//Initialize task interval
		const interval$ = interval(WorkflowInterval.ShortTaskReloadInterval).pipe(
			tap(async () => {
				await this.workflowMainTaskSidebarService.loadWorkflowTasks();
			})
		).subscribe();

		//Cleanup task subscriptions when component is destroyed.
		this.subscriptions.push(task$);
		this.subscriptions.push(interval$);
	}

	private async getFilterDefinitions() {
		this.filterDefinitions = await this.workflowMainTaskSidebarService.loadFilterDefinitions();
	}

	private prepareToolbar() {
		const menuItems: ConcreteMenuItem<IDropdownBtnMenuItem>[] = [
			{
				caption: {key: 'cloud.desktop.filterdefFooterBtnSave'},
				hideItem: false,
				disabled: this.disableButtonCheckToolbar(true),
				iconClass: 'tlb-icons ico-save',
				id: 'save',
				sort: 1,
				type: ItemType.Item,
				fn: () => {
					this.workflowMainTaskSidebarService.prepareSaveFilterDefinition();
				}
			},
			{
				caption: {key: 'cloud.desktop.filterdefFooterBtnSaveAs'},
				hideItem: false,
				disabled: this.disableButtonCheckToolbar(false),
				iconClass: 'tlb-icons ico-save-as2',
				id: 'saveAs',
				sort: 2,
				type: ItemType.Item,
				fn: () => {
					this.customDialogService.show(this.dialogOptions);
				}
			},
			{
				caption: {key: 'cloud.desktop.filterdefFooterBtnDelete'},
				hideItem: false,
				disabled: this.disableButtonCheckToolbar(true),
				iconClass: 'tlb-icons ico-delete2',
				id: 'delete',
				sort: 3,
				type: ItemType.Item,
				fn: () => {
					this.showDeleteDialog();
				}
			},
		];

		const item: ConcreteMenuItem<IDropdownBtnMenuItem>[] = [{
			caption: '',
			hideItem: false,
			iconClass: 'tlb-icons ico-menu',
			id: 'settings',
			layoutChangeable: true,
			layoutModes: 'vertical',
			type: ItemType.DropdownBtn,
			list: {
				showTitles: true,
				cssClass: 'radio-group',
				activeValue: 't-addObject',
				items: menuItems
			},
			sort: 1
		}];

		this.toolbarData = {
			iconClass: 'tlb-icons ico-menu',
			layoutChangeable: true,
			showTitles: true,
			cssClass: 'radio-group',
			activeValue: 't-addObject',
			items: item,
		};
	}

	private formatTaskList(tasks: ITaskList[]) {
		tasks.forEach(task => {
			//value.OwnerIcon = this.taskSidebarService.getOwnerIcon()
			if (task.LifetimeIcon === undefined) {
				task.PriorityIcon = this.convertPrioToIcon(task.PriorityId);
				task.LifetimeIcon = this.convertLifetimeToIcon(task.Endtime, task.Lifetime);
			}
		});
		return tasks;
	}

	private convertPrioToIcon(priority: number) {
		if (priority < 10) {
			return 'assets/ui/common/images/control-icons.svg#ico-prio0' + priority;
		} else {
			return 'assets/ui/common/images/control-icons.svg#ico-prio' + priority;
		}
	}

	private convertLifetimeToIcon(endtimeDateIso: string, lifetime: number) {
		const baseSprite = 'assets/ui/common/images/control-icons.svg#';
		if (endtimeDateIso) {
			const endtime = new Date(endtimeDateIso).toLocaleTimeString();
			const currentTime = new Date().toLocaleTimeString();
			if (currentTime > endtime) {
				return baseSprite + 'ico-lifetime-0';
			} else if (this.addLifetime(lifetime, 0.25) > endtime) {
				return baseSprite + 'ico-lifetime-25';
			} else if (this.addLifetime(lifetime, 0.5) > endtime) {
				return baseSprite + 'ico-lifetime-50';
			} else if (this.addLifetime(lifetime, 0.75) > endtime) {
				return baseSprite + 'ico-lifetime-75';
			} else {
				return baseSprite + 'ico-lifetime-100';
			}
		} else {
			return baseSprite + 'ico-lifetime-100';
		}
	}

	private addLifetime(lifetime: number, percentage: number) {
		const date = new Date();
		const minutes = (lifetime * 60) * percentage;
		return addMinutes(date, minutes).toLocaleTimeString();
	}

	public formatDate(inputDate: string, started: boolean): string {
		return this.workflowMainTaskSidebarService.formatDate(inputDate, started);
	}



	/**
	 * Function for the filterDefinition lookup.
	 * Finds the needed filterDefinition and sorts and groups the tasklist with its values
	 */
	private useFilterDefinitions() {
		const filter = this.filterDefinitions.find(obj => obj.filterName === this.workflowMainTaskSidebarService.LookupValue.filterDefinitionName);
		if (filter) {
			this.workflowMainTaskSidebarService.parseFilterDefinitions(filter.filterDef);
			this.workflowMainTaskSidebarService.sortTaskList(this.sortingAscending);
		}
	}

	public prepareSidebarTitle(): Translatable{
		if(this.workflowMainTaskSidebarService){
			return ` (${this.workflowMainTaskSidebarService.TaskList.length}/${this.workflowMainTaskSidebarService.TaskCount})`;
		}
		return '';
	}


	private deleteFilterDefinition() {
		const filter = this.filterDefinitions.find(obj => obj.filterName === this.workflowMainTaskSidebarService.LookupValue.filterDefinitionName);
		const filterDto = {
			accessLevel: filter?.accessLevel,
			filterName: this.workflowMainTaskSidebarService.LookupValue.filterDefinitionName,
			moduleName: 'basics.workflow'
		};
		this.taskSidebarService.deleteFilterDefinition(filterDto);
	}

	private async showDeleteDialog() {
		const deleteDialogOptions: IYesNoDialogOptions = {
			headerText: {key: 'cloud.desktop.taskList.settingdefConfirmDeleteTitle'},
			bodyText: 'Do you really want to delete the setting "' + this.workflowMainTaskSidebarService.LookupValue.filterDefinitionName + '"',
			showCancelButton: false,
		};
		const result = await this.messageBoxService.showYesNoDialog(deleteDialogOptions);
		if (result?.closingButtonId === 'yes') {
			this.deleteFilterDefinition();
		}
	}

	private disableButtonCheckToolbar(needsValue: boolean) {
		if (!needsValue) {
			return this.workflowMainTaskSidebarService.LookupValue.filterDefinitionName !== '';
		} else {
			return this.workflowMainTaskSidebarService.LookupValue.filterDefinitionName === '';
		}
	}

	/**
	 * Toggles the settings for grouping and sorting.
	 */
	public toggleGroupingSettings() {
		this.groupingToggle = !this.groupingToggle;
	}

	/**
	 * Function for the grouping lookup.
	 * Groups the tasklist.
	 */
	private groupTaskList() {
		this.accordionData = [];
		if (this.workflowMainTaskSidebarService.LookupValue.grouping !== '') {
			const taskListMap = new Map<string, ITaskList[]>();
			this.workflowMainTaskSidebarService.TaskList.forEach(task => {
				const value = this.getTaskValue(this.workflowMainTaskSidebarService.LookupValue.grouping, task);
				if (!taskListMap.has(value)) {
					taskListMap.set(value, []);
				}
				taskListMap.get(value)!.push(task);
			});
			const groupedTaskList: ITaskList[][] = [];
			taskListMap.forEach(task => {
				groupedTaskList.push(task);
			});
			this.pushGroupedTaskList(groupedTaskList);
		} else {
			this.prepareTasksForAccordion();
		}
	}

	private prepareTasks() {
		this.workflowMainTaskSidebarService.sortTaskList(true);
		this.accordionData = [];
		if (this.workflowMainTaskSidebarService.LookupValue.grouping !== '') {
			this.groupTaskList();
		} else {
			this.prepareTasksForAccordion();
		}
	}

	private pushGroupedTaskList(groupedTaskList: ITaskList[][]) {
		groupedTaskList.forEach(taskArray => {
			const accordionChildren: IAccordionItem[] = [];
			const currentIndex = groupedTaskList.indexOf(taskArray);
			const taskCountString = ' (' + groupedTaskList[currentIndex].length + ')';
			const value = this.getTaskValue(this.workflowMainTaskSidebarService.LookupValue.grouping, taskArray[0]);
			const accordionTask: IAccordionItem = {
				id: value ? value : this.workflowMainTaskSidebarService.LookupValue.grouping,
				title: value ? value + taskCountString : this.workflowMainTaskSidebarService.LookupValue.grouping + taskCountString,
			};
			taskArray.forEach(task => {
				const value = this.getTaskValue(this.workflowMainTaskSidebarService.LookupValue.grouping, task);
				const accordionChild: IAccordionItem = {
					id: value ? value : this.workflowMainTaskSidebarService.LookupValue.grouping,
					title: task.Description,
					comment: task.Started.toString()
				};
				accordionChildren.push(accordionChild);
			});
			accordionTask.children = accordionChildren;
			this.accordionData.push(accordionTask);
		});
	}

	private getTaskValue(keyString: string, task: ITaskList) {
		type ObjectKey = keyof typeof task;
		const key = keyString as ObjectKey;
		if (task[key] !== null && task[key]) {
			return task[key]!.toString();
		}
		return '';
	}

	private prepareTasksForAccordion() {
		this.accordionData = [];
		if (this.workflowMainTaskSidebarService.TaskList.length === 0) {
			return;
		}

		const accordionChildren: IAccordionItem[] = [];
		const id: string = 'Tasks';
		const accordion: IAccordionItem = {
			id: id,
			title: id + ' (' + this.workflowMainTaskSidebarService.TaskList.length + ')',
			hidden: false,
			expanded: true
		};
		this.workflowMainTaskSidebarService.TaskList.forEach(task => {
			const accordionChild: IAccordionItem = {
				id: task.Id,
				title: task.Description,
				comment: this.formatDate(task.Started, true)
			};
			accordionChildren.push(accordionChild);
		});
		accordion.children = accordionChildren;
		this.accordionData.push(accordion);
	}

	/**
	 * Prepares the input of selected task details to task-sidebar-detail
	 * on click of an item from accordion data list.
	 * @param changeInfo
	 */
	public onItemClick(changeInfo: IAccordionItem): void {
		if (changeInfo.id === 'Tasks') {
			return;
		}
		if (changeInfo.id && this.workflowMainTaskSidebarService.TaskList.length) {
			this.taskContext = {
				tasks: this.workflowMainTaskSidebarService.TaskList,
				selectedId: changeInfo.id
			};
		}
		this.showTaskDetail = true;
	}

	public onBackButtonClick(): void {
		this.showTaskDetail = false;
	}

	/**
	 * Filters the tasklist based on the given search string
	 * @param search
	 */
	public searchTasksInTaskList(search: string) {
		this.accordionData.forEach((data) => {
			if (!data.children) {
				data.hidden = !(data.title as string).toLowerCase().includes(search.toLowerCase());
			}
			if(data.children){
				data.children = data.children.filter(c => (c.title as string).toLowerCase().includes(search.toLowerCase()));
			}
		});
	}

	private async clearNotifications() {
		this.workflowMainTaskSidebarService.clearNotifications();
		this.filterOptions.taskListIsLoaded = false;
	}

	private toggleMaximize() {
		this.sidebarService.sidebarOptions.isMaximized = !this.sidebarService.sidebarOptions.isMaximized;
		if (this.toolbarItems.items) {
			this.toolbarItems.items[5].iconClass = this.sidebarService.sidebarOptions.isMaximized ? 'tlb-icons ico-sdb-minimize' : 'tlb-icons ico-sdb-maximize';
		}
	}

	/**
	 * Open or close the search input field
	 * @private
	 */
	private toggleSearch() {
		this.searchToggle = !this.searchToggle;
	}

	/**
	 * filter task list based on entity facade.
	 */
	public async prepareEntityFilter(): Promise<void> {
		this.isFilterDisable = !this.isFilterDisable;
		if (this.isFilterDisable) {
			const actionInstanceIds: number[] = this.workflowMainTaskSidebarService.TaskList.map(task => task.Id);
			const entityResponse = await this.taskSidebarService.getEntityIdListForActionInstances(actionInstanceIds);

			this.workflowMainTaskSidebarService.TaskList.forEach(task => {
				const entityIds = entityResponse[task.Id] || [];
				task.EntityIdList = entityIds;
				task.IsEntityListLoaded = entityIds.length > 0;
			});

			let filteredTaskList = this.workflowMainTaskSidebarService.TaskList.filter(task => task.IsEntityListLoaded);
			this.sidebarPinService = await this.lazyInjector.inject(TASK_SIDEBAR_TAB_SERVICE);
			const mainItemIds = this.sidebarPinService.getEntityIdListForActionInstances();

			// mainItemIds having value inside it indicates entity of a module is selected.
			if (mainItemIds && mainItemIds.length > 0) {
				filteredTaskList = filteredTaskList.filter(task =>
					task.EntityIdList.some(entityId => mainItemIds.includes(entityId))
				);
				//prepare newTaskList :
				this.workflowMainTaskSidebarService.TaskList = filteredTaskList;
			} else {
				this.workflowMainTaskSidebarService.TaskList = [];
			}

		} else {
			if (this.newTaskList.length > 0) {
				this.workflowMainTaskSidebarService.TaskList = this.newTaskList;
			}
		}
		this.workflowMainTaskSidebarService.sortTaskList(this.sortingAscending);
	}

	public get LookUpValueByService(){
		return this.workflowMainTaskSidebarService.LookupValue;
	}

	public ngOnDestroy() {
		this.subscriptions.forEach(sub => {
			sub.unsubscribe();
		});
	}
}