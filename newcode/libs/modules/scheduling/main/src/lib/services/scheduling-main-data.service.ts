/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole, IDataServiceOptions, IFieldInfo, IReadOnlyField, EntityArrayProcessor }
	from '@libs/platform/data-access';

import { IActivityEntity, IActivityRelationshipEntity, ICalculationActivityEntity, ILineItemProgressEntity } from '@libs/scheduling/interfaces';
import { ActivityComplete } from '../model/activity-complete.class';
import { SchedulingMainActivityLoaded } from '../model/entities/scheduling-main-activity-loaded.class';
import { FieldType, IEditorDialogResult, IFormConfig, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { IIdentificationData, ISearchPayload, ISearchResult, PlatformHttpService } from '@libs/platform/common';
import { isNull } from 'lodash';
import { ISchedulingActivityRequestEntity } from '@libs/scheduling/shared';
import { SchedulingMainDueDateService } from './scheduling-main-due-date.service';

interface ISimulatedGanttConfigFormEntity{
	DisplayTimeZone :number;
	Week : number ;
	OnlyWithObject :boolean;
}
export interface ITimeSpanUnitOptions{
	id:number,
	displayName:string
}
export const timeSpanUnitOptions:ITimeSpanUnitOptions[] = [
	{ id: 1, displayName: 'Days' },
	{ id: 2, displayName: 'Weeks' },
	{ id: 3, displayName: 'Months' },
	{ id: 4, displayName: 'Years' }
];

interface IActivitySettingsFormEntityInterface{
	ReportDate ?:string | null;
	Description ?: string | null;
	EnableTransitionRoot :boolean;
}
@Injectable({
	providedIn: 'root'
})

export class SchedulingMainDataService extends DataServiceHierarchicalRoot<IActivityEntity, ActivityComplete> {

	//TODO
	// activityPlanningChange from activity options dialog
	private activityPlanningChange: ICalculationActivityEntity | null = null;
	private updateHammockToolBar: [] | null = null;
	private postProcess: [] | null = null;
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	//TODO How to set the value of insertActivity?
	private insertActivity: boolean = false;
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly schedulingMainDueDateService = inject(SchedulingMainDueDateService);
	private readonly http = inject(PlatformHttpService);
	public transientRootEntityEnabled = false;

	private isCreateChild: boolean = false;

	private isCreating: boolean = false;
	private isValidateDone: boolean = true;
	private isUpdateDone: boolean = true;

	public constructor() {
		const options: IDataServiceOptions<IActivityEntity> = {
			apiUrl: 'scheduling/main/activity',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				prepareParam: ident => {
					return { mainItemId : ident.pKey1!};
				},
				usePost : true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident: IIdentificationData) => {
					return {mainItemId: ident.pKey1};
				},
				endPoint: 'multidelete',
				usePost: true,
			},
			roleInfo: <IDataServiceRoleOptions<IActivityEntity>>{
				role: ServiceRole.Root,
				itemName: 'Activities',
			},
			entityActions: {createSupported: true, deleteSupported: true},
			processors: [new EntityArrayProcessor<IActivityEntity>(['ChildItems'])],
		};
		super(options);
	}

	public override childrenOf(element: IActivityEntity): IActivityEntity[] {
		if (element) {
			return element.Activities ?? [];
		}
		return [];
	}

	public override parentOf(element: IActivityEntity | null): IActivityEntity | null {
		if (element?.ParentActivityFk === undefined) {
			return null;
		}

		const parentId = element?.ParentActivityFk;
		const foundParent = this.flatList().find(candidate => candidate.Id === parentId);

		if (foundParent === undefined) {
			return null;
		}

		return foundParent;
	}

	public override getModificationsFromUpdate(complete: ActivityComplete): IActivityEntity[] {
		if (complete.Activities === null) {
			complete.Activities = [];
		}
		return complete.Activities;
	}

	protected override checkCreateIsAllowed(entities: IActivityEntity[] | IActivityEntity | null): boolean {
		return true;
	}

	public updateWithPostProcess(postProces: []): Promise<void> {

		this.postProcess = postProces;
		//TODO doUpdate Method
		// return data.doUpdate(data)
		// 	.then((result: any) => {
		// 		this.postProcess = null;
		// 		return result;
		// 	})
		// 	.catch((error: any) => {
		// 		this.postProcess = null;
		// 		// Optionally, handle the error here
		// 		throw error;
		// 	});
		this.postProcess = null;
		return Promise.resolve(); // Keep it as a resolved Promise<void> for now
	}

	public isCreateAutoGenerationDisabled(): boolean {
		return false; // Check from PlatformPermissionService.hasCreate()
	}

	public createAutoIntegratedRoot() {
		// Set IProjectGroupEntity.IsAutoIntegration = true
		// Create item
	}

	public override createUpdateEntity(modified: IActivityEntity | null): ActivityComplete {
		const complete = new ActivityComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id?modified.Id:0;
			complete.Activities = [modified];
		}
		return complete;
	}

	public takeOverActivities(activities: IActivityEntity[] | null, markAsModified: boolean) {
		const modified: IActivityEntity[] = [];
		const list = this.getList();
		activities?.forEach((act) => {
			const loadedAct = list.find(a => a.Id = act.Id);

			if (loadedAct !== null && loadedAct !== undefined) {
				//TODO
				// loadedAct.image = act.image;
				loadedAct.ActivityTypeFk = act.ActivityTypeFk;
				if (loadedAct.Activities?.length === 0) {
					//TODO
					/* if (loadedAct.nodeInfo) {
						  loadedAct.nodeInfo.children = false;
						  loadedAct.nodeInfo.collapsed = true;
					   }*/
					loadedAct.HasChildren = false;
				}
				loadedAct.PlannedStart = act.PlannedStart;
				loadedAct.PlannedFinish = act.PlannedFinish;
				loadedAct.PlannedDuration = act.PlannedDuration;
				loadedAct.PlannedCalendarDays = act.PlannedCalendarDays;
				loadedAct.ActualStart = act.ActualStart;
				loadedAct.ActualFinish = act.ActualFinish;
				loadedAct.ActualDuration = act.ActualDuration;
				loadedAct.ActualCalendarDays = act.ActualCalendarDays;
				loadedAct.ExecutionStarted = act.ExecutionStarted;
				loadedAct.ExecutionFinished = act.ExecutionFinished;
				loadedAct.CurrentStart = act.CurrentStart;
				loadedAct.CurrentFinish = act.CurrentFinish;
				loadedAct.CurrentDuration = act.CurrentDuration;
				loadedAct.CurrentCalendarDays = act.CurrentCalendarDays;
				loadedAct.EarliestStart = act.EarliestStart;
				loadedAct.LatestStart = act.LatestStart;
				loadedAct.EarliestFinish = act.EarliestFinish;
				loadedAct.LatestFinish = act.LatestFinish;
				loadedAct.ConstraintDate = act.ConstraintDate;
				loadedAct.Quantity = act.Quantity;
				loadedAct.ResourceFactor = act.ResourceFactor;
				loadedAct.PerformanceFactor = act.PerformanceFactor;
				loadedAct.PeriodQuantityPerformance = act.PeriodQuantityPerformance;
				loadedAct.DueDateQuantityPerformance = act.DueDateQuantityPerformance;
				loadedAct.PeriodWorkPerformance = act.PeriodWorkPerformance;
				loadedAct.DueDateWorkPerformance = act.DueDateWorkPerformance;
				loadedAct.PercentageCompletion = act.PercentageCompletion;
				loadedAct.RemainingActivityQuantity = act.RemainingActivityQuantity;
				loadedAct.RemainingActivityWork = act.RemainingActivityWork;
				loadedAct.LastProgressDate = act.LastProgressDate;
				loadedAct.HasCalculatedEnd = act.HasCalculatedEnd;
				loadedAct.HasCalculatedStart = act.HasCalculatedStart;
				loadedAct.IsAssignedToEstimate = act.IsAssignedToEstimate;
				//TODO Version is readonly
				// loadedAct.Version = act.Version;
				loadedAct.IsAssignedToHammock = act.IsAssignedToHammock;
				loadedAct.RemainingDuration = act.RemainingDuration;
				loadedAct.EstimateHoursTotal = act.EstimateHoursTotal;
				if (act.ParentActivityFk === null /*TODO && isTransientRootEntityActive()*/) {
					 act.ParentActivityFk = -1;
				}

				loadedAct.ActivityRelationshipEntities_ChildActivityFk = act.ActivityRelationshipEntities_ChildActivityFk;
				loadedAct.ActivityRelationshipEntities_ParentActivityFk = act.ActivityRelationshipEntities_ParentActivityFk;
				loadedAct.Successor = act.Successor;
				loadedAct.Predecessor = act.Predecessor;

				modified.push(loadedAct);

				this.processor.process(loadedAct);
			}
		});

		if (markAsModified) {
			modified.forEach((mod) => {
				this.setModified(mod);
			});
		} else {
			modified.forEach((mod) => {
				this.setModified(mod);
			});
		}
	}

	public mergePlanningChange(former: ICalculationActivityEntity, latest: ICalculationActivityEntity) {
		if (!!latest.StartDate || !!latest.EndDate) {
			former.StartDate = null;
			former.EndDate = null;
		}
		return Object.assign(former, latest);
	}

	protected override provideLoadPayload(): object {
		return {};
	}

	// public override getModificationsFromUpdate(complete: ActivityComplete): IActivityEntity[] {
	// 	if (complete.Activities === null){
	// 		return complete.Activities = [];
	// 	}else{
	// 		return complete.Activities;
	// 	}
	// }

	public mergeInActivityChange(newItem: IActivityEntity) {
		this.processor.process(newItem);
		const oldItem = this.getList().find(i => i.Id === newItem.Id);
		//TODO data.mergeItemAfterSuccessfullUpdate(oldItem, newItem, true, data);
		if(oldItem){
			this.setModified(oldItem);
		}
	}

	public calculateActivities(parameter: ICalculationActivityEntity | null, responseData: object) {
		let activities: IActivityEntity[] | null = [];
		if (Array.isArray((responseData as ActivityComplete)?.Activities)) {
			activities = (responseData as ActivityComplete)?.Activities;
		} else if (!!(responseData as ActivityComplete)?.Activities && responseData) {
			activities = [responseData as IActivityEntity];
		}

		const allActivities = activities?.flat(10) as IActivityEntity[];

		if (allActivities !== null) {
			this.processor.process(allActivities);
		}

		this.takeOverActivities(activities, false);
		if (parameter !== null && parameter !== undefined) {

			if (this.activityPlanningChange === null || this.activityPlanningChange === undefined) {
				this.activityPlanningChange = {};
			}
			this.activityPlanningChange = this.mergePlanningChange(this.activityPlanningChange, parameter);
		}
	}

	public processItem(item: ILineItemProgressEntity) {
		const fields: IFieldInfo<ILineItemProgressEntity>[] = [
			{field: 'PeriodQuantityPerformance', readonly: item.ProgressReportMethodFk !== 4} as IFieldInfo<ILineItemProgressEntity>,
			{field: 'DueDateQuantityPerformance', readonly: item.ProgressReportMethodFk !== 4} as IFieldInfo<ILineItemProgressEntity>,
			{field: 'RemainingLineItemQuantity', readonly: item.ProgressReportMethodFk !== 4} as IFieldInfo<ILineItemProgressEntity>,
			{field: 'PeriodWorkPerformance', readonly: item.ProgressReportMethodFk !== 5} as IFieldInfo<ILineItemProgressEntity>,
			{field: 'DueDateWorkPerformance', readonly: item.ProgressReportMethodFk !== 5} as IFieldInfo<ILineItemProgressEntity>,
			{field: 'RemainingLineItemWork', readonly: item.ProgressReportMethodFk !== 5} as IFieldInfo<ILineItemProgressEntity>
		];

		this.setEntityReadOnlyFields(item, fields as IReadOnlyField<[ILineItemProgressEntity]> []);
	}

	public takeOverRelations(relationships: IActivityRelationshipEntity[]) {
		//TODO
	}

	public processActivity(activityId:number) {
		//TODO getItemById function and processItem function
		// let activity = this.getItemById(activityId);
		// schedulingMainModifyActivityProcessor.processItem(activity);
	}

	public changeActivityType(): void {
		let activities: IActivityEntity[], fire: boolean, parameter: { Id: number; Duration: number } | undefined;
		const activity = this.getSelection()[0];
		if (activity !== null && activity !== undefined) {
			if (activity && typeof activity.Id === 'number' && [1, 3, 4, 5].includes(activity.ActivityTypeFk!)) {
				if (activity.ActivityTypeFk === 1) {
					if (activity.PlannedDuration === 1) {
						activity.PlannedDuration = 0;
						activity.CurrentDuration = 0;
						parameter = {
							Id: activity.Id,
							Duration: 0
						};
					}
					activity.ActivityTypeFk = 3;
				} else if (activity.ActivityTypeFk === 3 && !activity.IsAssignedToHammock) {
					if (activity.PlannedDuration === 0) {
						activity.PlannedDuration = 1;
						activity.CurrentDuration = 1;
						parameter = {
							Id: activity.Id,
							Duration: 1
						};
					}
					activity.ActivityTypeFk = 5;
				} else if (activity.ActivityTypeFk === 5 && activity.Schedule?.ScheduleMasterFk === null) {
					activity.ActivityTypeFk = 4;
					//TODO data.updateToolBar.fire();
				} else if (activity.ActivityTypeFk === 5 && activity.Schedule?.ScheduleMasterFk !== null) {
					activity.ActivityTypeFk = 1;
				} else if (activity.ActivityTypeFk === 4 && activity.Schedule?.ScheduleMasterFk === null) {
					activity.ActivityTypeFk = 1;
					// TODO data.updateToolBar.fire();
				} else if (activity.IsAssignedToHammock && activity.ActivityTypeFk === 3) {
					if (activity.PlannedDuration === 0) {
						activity.PlannedDuration = 1;
					}
					activity.ActivityTypeFk = 1;
				}

				if (parameter !== undefined) {
					if (this.activityPlanningChange === null || this.activityPlanningChange === undefined) {
						this.activityPlanningChange = {};
					}
					this.mergePlanningChange(this.activityPlanningChange, parameter);
				}

				fire = false;
				activities = this.getList();
				activities.forEach((item: IActivityEntity) => {
					if (item.Id === activity.Id) {
						item.ActivityTypeFk = activity.ActivityTypeFk;
						//TODO platformDataServiceDataProcessorExtension.doProcessItem(item, data);
						fire = true;
						this.setModified(activity);
					}
				});
				if (fire) {
					this.setModified(activity);
				}
				this.doCallBackOnChangeActivityType();
			}
		} else {
			this.messageBoxService.showInfoBox('Please select a record first', 'info', true);
		}
	}
	public settingsDialog() {
		this.formDialogService.showDialog<IActivitySettingsFormEntityInterface>({
			headerText: 'scheduling.main.activitySettings',
			formConfiguration: this.getActivitySettingsFormConfiguration,
			entity: this.activitySettings,
			runtime: undefined,
			customButtons: [],
			topDescription: '',
			width: '1200px',
			maxHeight: 'max',
		})?.then((result: IEditorDialogResult<IActivitySettingsFormEntityInterface>) => {
			if (result.closingButtonId === StandardDialogButtonId.Ok && result.value) {
				this.activitySettingsHandleOK(result.value);
			}
		});
	}
	/**
	 * copyOptions dialog form controls data. let selected = this.dataService.getSelection();
	 */
	public activitySettings: IActivitySettingsFormEntityInterface = {
		EnableTransitionRoot: false,
		ReportDate :Date()
	};
	private getActivitySettingsFormConfiguration: IFormConfig<IActivitySettingsFormEntityInterface> = {
		formId: 'scheduling.main.addProgress',
		showGrouping: true,
		groups: [

			{
				groupId: 'performance',
				header: { key : 'scheduling.main.headerPerformanceSettingsDialog'},
				open: true
			},
			{
				groupId: 'general',
				header: { key : 'scheduling.main.enableTransientRootEntity'},
				open: true
			},
		],
		rows: [
			{
				groupId: 'performance',
				id:'reportdate',
				label: {
					key : 'scheduling.main.dueDate',
				},
				type: FieldType.DateUtc,
				model:'ReportDate',
			},

			{
				groupId: 'performance',
				id: 'description',
				label: {
					key : 'cloud.common.entityDescription',
				},
				type: FieldType.Description,
				model: 'Description',
			},
			{
				groupId: 'general',
				id: 'enableTransientRootEntity',
				label: {
					key : 'scheduling.main.enableTransientRootEntity',
				},
				type: FieldType.Boolean,
				model: 'EnableTransitionRoot',
			},
		],

	};
	/**
	 * copyOptions dialog form controls data. let selected = this.dataService.getSelection();
	 */

	public doCallBackOnChangeActivityType(): void {
		if (this.updateHammockToolBar !== undefined && this.updateHammockToolBar !== null && this.updateHammockToolBar.length > 0) {
			//TODO Logic of the updateHammockToolBar variable
			// this.updateHammockToolBar.forEach(this.updateHammockToolBar, (method: Function) => {
			// 	method();
			// });
		}
	}

	public activitySettingsHandleOK(result:IActivitySettingsFormEntityInterface){
		//TODO needs to migrate the schedulingMainDueDateService
		// schedulingMainDueDateService.setPerformanceDueDate(result.data.dueDate);
		// schedulingMainDueDateService.setPerformanceDescription(result.data.description);
		this.setTransientRootEntityEnable(result.EnableTransitionRoot);
	}

	public toolbarEnabled(){
		const activity = this.getSelectedEntity();
		if (Array.isArray(activity) && activity.length === 0) {
			return true;
		}
		if(activity!==null){
			return !(activity.ActivityTypeFk === 1 || activity.ActivityTypeFk === 3 || (activity.ActivityTypeFk === 4 && activity.ScheduleSubFk === null) || (activity.ActivityTypeFk === 5 && !activity.HasHammock));
		}
		return true;
	}
	protected override onCreateSucceeded(created: object): IActivityEntity {
		//TODO validateCode, removeLinksToNewSummary, handle ParentActivityFk, validationHelperForMakeSummary

		const createdActivity = created as IActivityEntity;

		if (createdActivity?.ParentActivityFk) {
			const parent = this.parentOf(createdActivity);

			if (parent) {
				if (!this.isCreateChild) {
					parent.Activities?.push(createdActivity);
				} else {
					if (!parent.Activities) {
						parent.Activities = [] as IActivityEntity[];
					}
				}
			}
		}

		this.isCreating = false;
		return createdActivity;
	}
   public setTransientRootEntityEnable(enable:boolean){
		if (this.transientRootEntityEnabled !== enable) {
			const isTransientRootEntityActivBeforeChangingEnableState = this.isTransientRootEntityActive();
			this.asyncSetUserTransientRootEnable(enable);
			this.transientRootEntityEnabled = enable;
			if (this.isTransientRootEntityActive() !== isTransientRootEntityActivBeforeChangingEnableState) {
				//TODO reload functionality
				//service.reload();
			}

		}
	}

	public asyncSetUserTransientRootEnable(enable:boolean) {
		return this.http.post('scheduling/main/activity/setusertransientrootenable?enable=' + enable, {});
	}

	public isTransientRootEntityActive() {
		// TODO needs to migrate schedulingSchedulePinnableEntityService and schedulingSchedulePresentService
		// return this.transientRootEntityEnabled && (!!schedulingSchedulePinnableEntityService.getPinned() || schedulingSchedulePresentService.isLoadingForPininng());
		return true; // keep it as true for now
	}

	protected override onLoadSucceeded(loaded: SchedulingMainActivityLoaded): IActivityEntity[] {
		this.isUpdateDone = true;

		if (loaded) {
			return loaded.dtos;
		}
		return [];
	}

	protected override provideCreatePayload(): object {
		this.isCreating = true;

		this.isCreateChild = false;
		const selectedActivity = this.getSelectedEntity();
		const parent = this.parentOf(selectedActivity);
		const parentId: number | null | undefined = selectedActivity?.ParentActivityFk;
		return this.getCreatePayload(selectedActivity, parent, parentId);
	}

	protected override provideCreateChildPayload(): object{
		this.isCreating = true;

		this.isCreateChild = true;
		const selectedActivity = this.getSelectedEntity();
		const parent = selectedActivity;
		const parentId: number | null | undefined = selectedActivity?.Id;
		return this.getCreatePayload(selectedActivity, parent, parentId);
	}

	public getCreatePayload(selectedActivity: IActivityEntity | null, parent: IActivityEntity | null, parentId: number | null | undefined){
		let scheduleId: number | null | undefined = 0;
		let projectId: number | null | undefined = 0;
		let lastCode: string | null | undefined = '';
		let newHierarchy: boolean = false;

		if (parent && parent.ScheduleFk) {
			scheduleId = parent.ScheduleFk;
			projectId = parent.ProjectFk;
		} else {
			//TODO get Id and ProjectFk from selected Schedule
			scheduleId = selectedActivity?.ScheduleFk;
			projectId = selectedActivity?.ProjectFk;
		}

		if (selectedActivity) {
			if (selectedActivity.Id === -1) {
				parent = selectedActivity;
				parentId = -1;
			}
			lastCode = selectedActivity.Code;
			//TODO get value of insertActivity
		} else {
			this.insertActivity = false;
		}

		if (parent) {
			newHierarchy = lastCode === parent.Code;
		} else {
			parentId = null;
		}

		return {
			insertActivity: this.insertActivity,
			lastCode: lastCode,
			newHierarchy: newHierarchy,
			parent: parent === null ? {}: parent,
			parentId	: parentId,
			projectId: projectId,
			scheduleId:	scheduleId,
			selectedActivity: selectedActivity
		};
	}

public simulationGanttSettingsDialog() {
		this.formDialogService.showDialog<ISimulatedGanttConfigFormEntity>({
			headerText: 'scheduling.main.simulatedGantt.configTitle',
			formConfiguration: this.simulatedGanttConfigFormConfiguration,
			entity: this.simulationGanttSetting,
			runtime: undefined,
			customButtons: [],
			topDescription: '',
			width: '1200px',
			maxHeight: 'max',
		});
	}
	/**
	 * copyOptions dialog form controls data. let selected = this.dataService.getSelection();
	 */
	public simulationGanttSetting: ISimulatedGanttConfigFormEntity = {
		DisplayTimeZone: 0, OnlyWithObject: false, Week: 0
	};
	private simulatedGanttConfigFormConfiguration: IFormConfig<ISimulatedGanttConfigFormEntity> = {
		formId: 'scheduling.main.simulatedGanttConfig',
		showGrouping: false,
		groups: [
			{
				groupId: 'default',
				header: { key: 'scheduling.main.simulatedGantt.configTitle' },
				open: true
			}
		],
		rows: [
			{
				groupId: 'default',
				id:'displayTimeZone',
				label: {
					key : 'scheduling.main.simulatedGantt.displayedTimeSpan',
				},
				type: FieldType.Integer,
				model:'DisplayTimeZone'
			},
			{
				groupId: 'default',
				id: 'displayedTimeSpanUnit',
				model: 'Week',
				label: 'scheduling.main.simulatedGantt.unit',
				type: FieldType.Select,
				itemsSource: {
					items:timeSpanUnitOptions,
				}
			},
			{
				id: 'default',
				label: 'scheduling.main.simulatedGantt.onlyWithModel',
				model: 'onlyWithModelObjects',
				type: FieldType.Boolean
			},
		],
	};

	public override canCreateChild(): boolean {
		const selectedEntity = this.getSelectedEntity();
		return super.canCreateChild() &&
			selectedEntity !== undefined &&
			selectedEntity !== null &&
			//TODO isValidateDone, TODO isUpdateDone, Where does update start and end?
			!this.isCreating && this.isValidateDone && this.isUpdateDone &&
			!selectedEntity.IsReadOnly &&
			(selectedEntity.ActivityTypeFk === 2 || !selectedEntity.IsAssignedToEstimate) &&
			!selectedEntity.HasHammock &&
			selectedEntity.ActivityTypeFk !== 4;
	}

	public override canCreate(): boolean {
		//TODO isValidateDone, isUpdateDone, Where does update start and end? context,
		// findPinning !== -1, !service.isCurrentTransientRoot
		return super.canCreate() &&
			!this.isCreating && this.isValidateDone && this.isUpdateDone;
	}

	public isCurrentTransientRoot() {
		const selectedItem = this.getSelectedEntity();
		return (selectedItem && selectedItem.Id === -1);
	}

	public override canDelete(): boolean {
		const selectedEntity = this.getSelectedEntity();

		//TODO isValidateDone, isUpdateDone, Where does update start and end?
		return super.canDelete() && !this.isCreating &&
			this.isValidateDone && this.isUpdateDone &&
			selectedEntity !== undefined &&
			selectedEntity !== null &&
			!selectedEntity.IsReadOnly;
	}

	protected override onLoadByFilterSucceeded(loaded: object): ISearchResult<IActivityEntity> {
		return loaded as ISearchResult<IActivityEntity>;
	}

	protected override provideLoadByFilterPayload(payload: ISearchPayload): object {
		this.extendSearchFilter(payload as ISchedulingActivityRequestEntity);
		return payload;
	}


	private extendSearchFilter(filterRequest: ISchedulingActivityRequestEntity) {
		delete filterRequest.pKeys;
		filterRequest.projectContextId = this.getSelectedEntity()?.ProjectFk as number | null;
		filterRequest.furtherFilters = [{
						Token	: 'INCLUDE_DUEDATE',
						Value: new Date().toISOString()
					}];
	}

	public appendActivity () {
		this.insertActivity = true;
		return this.create();
	}

	public updateFromEstimate(activity:IActivityEntity, sum:number){
		if (activity.IsDurationEstimationDriven){
			const action = {
				Action: 25,
				UpdatePlannedDurationData: {
					Activity: activity,
					EstimateHoursTotal: sum
				}
			};

			this.http.post<ActivityComplete>('scheduling/main/activity/execute', action).then((response) => {
				if (!response) {
					this.messageBoxService.showInfoBox('scheduling.main.modalInfoMessage', 'info', true);
				}
				this.calculateActivities(null, response);
			});
		}

	}

	public createDeepCopy() {
		const command = {Action: 13,EffectedItemId: this.getSelectedEntity()?.Id || -1};
		this.http.post<ActivityComplete>('scheduling/main/activity/execute', command)
			.then((response: ActivityComplete | null) => {
				if (response && response.Activities && response.Activities.length > 0) {
					const copy = response.Activities[0];
					if(this.onCreateSucceeded && !isNull(copy)){
						this.onCreateSucceeded(copy);
						this.create();
					}
				}
			});
	}

	public getDueDate() {
		return this.schedulingMainDueDateService.getPerformanceDueDateAsString();
	}
}