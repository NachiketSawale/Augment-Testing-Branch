/**
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { LazyInjectable, PlatformHttpService } from '@libs/platform/common';
import { ITaskList, ITaskCount, IWorkflowSidebarTask, WORKFLOW_TASK_SIDEBAR_TOKEN, ITaskListLookupValue, ITaskDialogValues, ITaskListFilterDefinition, ITaskListFilterDefs } from '@libs/workflow/interfaces';
import { Observable, BehaviorSubject, tap } from 'rxjs';

/**
 * Service used to handle workflow tasks in the sidebar.
 */
@LazyInjectable({
	token: WORKFLOW_TASK_SIDEBAR_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root'
})
export class WorkflowMainTaskService implements IWorkflowSidebarTask {


	private workflowTasks: ITaskList[] = [];
	private workflowTaskCount: number = 0;

	private workflowTasks$: BehaviorSubject<ITaskList[]> = new BehaviorSubject<ITaskList[]>([]);
	private workflowTaskCount$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

	private readonly httpService = inject(PlatformHttpService);
	private filterDefinitions: ITaskListFilterDefinition[] = [];
	private lookupValue: ITaskListLookupValue = {
		grouping: '',
		sorting: '',
		filterDefinitionName: '',
		radio: ''
	};
	private sortingAscending: boolean = false;

	public get TaskList() {
		return this.workflowTasks;
	}

	public set TaskList(taskList: ITaskList[]) {
		this.workflowTasks = taskList;
	}

	/**
	 * Loads all workflow client action tasks.
	 */
	public async loadWorkflowTasks() {
		this.TaskList = await this.httpService.get<ITaskList[]>('basics/workflow/runningworkflowaction/all/list');
		this.workflowTasks$.next(this.TaskList);
	}

	/**
	 * Loads the number of workflow tasks available for the current user.
	 */
	public async loadWorkflowTaskCount() {
		const taskCount = await this.httpService.get<ITaskCount>('basics/workflow/runningworkflowaction/count');
		this.workflowTaskCount = taskCount.RunningWorkflowActions;
		this.workflowTaskCount$.next(this.workflowTaskCount);
	}

	/**
	 * Function to saves the filter settings such as location, setting name, grouping and sorting configuration.
	 * @param filterDto
	 */
	public saveFilterDefinition(filterDto: object) {
		this.httpService.post('basics/workflow/filter/savefilterdefinition', filterDto);
	}

	public loadFilterDefinitions() {
		return this.httpService.get<ITaskListFilterDefinition[]>('basics/workflow/filter/getfilterdefinitions', { params: { moduleName: 'basics.workflow' } });
	}

	/**
	 * Returns an observable stream of the current client tasks for the user.
	 * @returns
	 */
	public get WorkflowSidebarTasks$(): Observable<ITaskList[]> {
		return this.workflowTasks$;
	}

	/**
	 * Removes the client action from the sidebar.
	 * @param id
	 */
	public removeWorkflowTask(id: number) {
		this.TaskList = this.TaskList.filter(item => item.Id !== id);
		this.workflowTaskCount$.next(this.TaskList.length);
		this.workflowTasks$.next(this.TaskList);
	}

	/**
	 * Gets an observable count of client actions available for the current user.
	 * @returns
	 */
	public get TaskCount$(): Observable<number> {
		return this.workflowTaskCount$.pipe(
			tap(taskCount => {
				if (taskCount !== this.TaskList.length) {
					this.loadWorkflowTasks();
				}
			})
		);
	}

	public get TaskCount(): number{
		return this.workflowTaskCount;
	}

	public clearNotifications(): void {
		const tasksToClear: ITaskList[] = [];
		const newList: ITaskList[] = [];
		this.TaskList.reduce((acc, obj, index, arr) => (obj.IsNotification ? tasksToClear.push(obj) : newList.push(obj), acc), []);
		const continuePromises: Promise<void>[] = [];
		if (tasksToClear && tasksToClear.length > 0) {
			tasksToClear.forEach(task => {
				task.Clerk = {
					Code: task.Clerk,
					Description: task.Clerk
				};
				if (!task.Context) {
					task.Context = '';
				}
				continuePromises.push(this.continueWorkflow(task));
			});
		}
		Promise.all(continuePromises).then(() => {
			this.loadWorkflowTaskCount();
		});
	}

	private async continueWorkflow(task: ITaskList) {
		await this.httpService.post('basics/workflow/instance/continue', task);
	}

	public formatDate(inputDate: string, started: boolean): string {
		const date = new Date(inputDate);
		const day = this.padZero(date.getDate());
		const month = this.padZero(date.getMonth() + 1);
		const year = date.getFullYear();
		if (started) {
			const hours = this.padZero(date.getHours());
			const minutes = this.padZero(date.getMinutes());
			return `${day}/${month}/${year} ${hours}:${minutes}`;
		} else {
			return `${day}/${month}/${year}`;
		}
	}

	private padZero(value: number): string {
		return value < 10 ? `0${value}` : value.toString();
	}

	public prepareSaveDefinitionAs(dialogValues: ITaskDialogValues) {
		const filterDto = this.createFilterDto(dialogValues.locationValue, dialogValues.settingName);
		this.saveFilterDefinition(filterDto);
	}

	public prepareSaveFilterDefinition() {
		const filter = this.filterDefinitions.find(obj => obj.filterName === this.lookupValue.filterDefinitionName);
		if (filter) {
			const filterDto = this.createFilterDto(filter.accessLevel, filter.filterName);
			this.saveFilterDefinition(filterDto);
		}
	}

	public get FilterDefinitions(): ITaskListFilterDefinition[] {
		return this.filterDefinitions;
	}

	public get LookupValue(): ITaskListLookupValue {
		return this.lookupValue;
	}

	public parseFilterDefinitions(filterDef: ITaskListFilterDefs) {
		const jsonObject = JSON.parse(filterDef.toString());
		this.LookupValue.grouping = jsonObject.grouping.value;
		if (this.LookupValue.grouping === 'EndDate') {
			this.LookupValue.grouping = 'Endtime';
		}
		this.sortingAscending = !jsonObject.sorting.desc;
		this.LookupValue.sorting = jsonObject.sorting.property;
	}

	private createFilterDto(location: string, name: string): ITaskListFilterDefinition {
		const locationValue = location;
		const settingName = name;

		const filterDef: ITaskListFilterDefs = {
			id: this.FilterDefinitions.length,
			name: settingName,
			grouping: {
				value: this.LookupValue.grouping,
				headerValue: this.LookupValue.grouping
			},
			sorting: {
				value: this.LookupValue.sorting,
				headerValue: this.LookupValue.sorting,
				desc: !this.sortingAscending
			}
		};

		return {
			accessLevel: locationValue,
			filterDef: filterDef,
			filterName: settingName,
			moduleName: 'basics.workflow'
		};
	}

	public sortTaskList(ascending: boolean) {
		this.sortingAscending = ascending;
		type ObjectKey = keyof typeof this.TaskList[0];
		let key = this.LookupValue.sorting as ObjectKey;
		if (this.LookupValue.sorting === '') {
			key = 'Id' as ObjectKey;
		}
		let sorting = 0;
		this.TaskList.sort((a: ITaskList, b: ITaskList) => {
			const aValue = a[key];
			const bValue = b[key];
			if (typeof aValue === 'string' && typeof bValue === 'string') {
				sorting = aValue.localeCompare(bValue);
			} else if (typeof aValue === 'number' && typeof bValue === 'number') {
				sorting = aValue - bValue;
			}
			return ascending ? sorting : -sorting;
		});
	}

	//TODO: Already seen tasklist
}