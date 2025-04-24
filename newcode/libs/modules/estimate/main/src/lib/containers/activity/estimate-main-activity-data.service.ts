/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { ISearchResult } from '@libs/platform/common';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole, IDataServiceOptions } from '@libs/platform/data-access';
import { ProjectMainDataService } from '@libs/project/shared';
import { IScheduleEntity,IScheduleExtendedEntity,ISmallActivityEntity } from '@libs/scheduling/interfaces';
import * as _ from 'lodash';
import { EstimateMainContextService } from '@libs/estimate/shared';
import { IEstRuleEntity } from '@libs/estimate/interfaces';
import { IEstActivities } from '../../model/interfaces/estimate-main-activities.interface';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import { EstimateMainService } from '../line-item/estimate-main-line-item-data.service';
// import { EstimateMainFilterService } from '../../services/filter-structures/estimate-main-filter-service';

export const ESTIMATE_MAIN_ACTIVITY_DATA_TOKEN = new InjectionToken<EstimateMainActivityDataService>('estimateMainActivityDataToken');

@Injectable({
	providedIn: 'root'
})
/**
 * Data service for the container
 */
export class EstimateMainActivityDataService extends DataServiceHierarchicalRoot<IEstActivities, IEstActivities> {   // TODO  need activitycomplete iteface from schedulling 
	// 	if (response.Valid && !response.ValidationError) { interface form scheduling need to check
	private readonly projectMainDataService = inject(ProjectMainDataService);
	private readonly contextService = inject(EstimateMainContextService);
	private readonly estimateMainService = inject(EstimateMainService);
	// prvate filterService = inject(EstimateMainFilterService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private ruleToDelete: IEstRuleEntity[]=[];
	private projectId = this.contextService.getSelectedProjectId();
	private isReadData = false;
	private readonly Id = '7a9f7da5c9b44e339d49ba149a905987';
	// TODO filterActivityItem = new Platform.Messenger();

	public constructor() {
		const options: IDataServiceOptions<IEstActivities> = {
			apiUrl: 'scheduling/main/activity',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'projectscheduleactivities',
				usePost: false,
			},
			roleInfo: <IDataServiceRoleOptions<IEstActivities>>{
				role: ServiceRole.Root,
				itemName: 'EstActivity',
			},
		};

		super(options);

		// TODO filter leading structure by line items
		// this.filterService.addLeadingStructureFilterSupport(this, 'PsdActivityFk');
	}

	protected override provideLoadByFilterPayload(): object {
		const selection = this.projectMainDataService.getSelection()[0];
		if (selection) {
			return { projectId: selection.Id };
		}
		return {};
	}

	public override childrenOf(element: IEstActivities): IEstActivities[] {
		return element.Activities ?? [];
	}

	protected override onLoadByFilterSucceeded(loaded: IEstActivities[]): ISearchResult<IEstActivities> {
		const result: (IScheduleEntity | ISmallActivityEntity)[] = [];
		const data: ISmallActivityEntity = this.addActivityVRoot(loaded);
		const itemList = this.getList();
		data.Activities?.forEach((item) => {
			if (item.Activities) {
				result.push(...this.flattenActivities(item.Activities));
			}
		});

		data.Activities?.forEach((item) => {
			item.Activities?.forEach((i) => {
				if (typeof i.PlannedStart === 'string' || i.PlannedStart instanceof Date) {
					i.PlannedStart = new Date(i.PlannedStart);
				}
				if (typeof i.PlannedFinish === 'string' || i.PlannedFinish instanceof Date) {
					i.PlannedFinish = new Date(i.PlannedFinish);
				}
			});
		});

		const estHeader = this.contextService.getSelectedEstHeaderItem();
		if (estHeader) {
			data.Code = estHeader?.Code;
			data.Description = estHeader?.DescriptionInfo?.Description ?? '';
			data.Id = estHeader?.Id;
		}

		const root: ISmallActivityEntity = {
			Code: '',
			Description: '',
			Id: 0,
			Activities: []
		};
		root.Activities?.push(data);
    
	 
		 if(this.estimateMainService.getHeaderStatus() ||!this.estimateMainService.hasCreateUpdatePermission()){
          if(itemList.length > 0){
			itemList.forEach((item: IEstActivities) => {
			
				this.setEntityReadOnlyFields(item,[{field:'Rule',readOnly:true},{ field:'Param',readOnly:true}]);
			});              
		 }
		}

		return {
			FilterResult: {
				ExecutionInfo: '',
				RecordsFound: 0,
				RecordsRetrieved: 0,
				ResultIds: []
			},
			dtos: root.Activities as IEstActivities[],
		};
	}

	/**
	 * For create, update entities
	 * @param modified item which is modified
	 * @returns complete entity of estimate
	 */
	// TODO - ActivityComplete to be replaced by EstMainComplete in all occurance /
	//     public  override createUpdateEntity(modified: ISmallActivityEntity | null): ActivityComplete {
	// 	const complete = new ActivityComplete();
	// 	if (modified !== null) {
	// 		complete.MainItemId = modified.Id ?? 0;
	// 		// TODO complete.EstActivityParamToSave = modified;
	// 	}

	// 	return complete;
	// }

	/**
	 * Recursive function to flatten nested Activities
	 * @param activities
	 * @returns Activities
	 */
	private flattenActivities(activities: ISmallActivityEntity[]): ISmallActivityEntity[] {
		const result: ISmallActivityEntity[] = [];
		activities.forEach((activity) => {
			result.push(activity);
			if (activity.Activities) {
				result.push(...this.flattenActivities(activity.Activities));
			}
		});

		return result;
	}

	/**
	 * To Attach a Schedule as a parent of each activities
	 * @param readData Responce from server
	 * @returns object
	 */
	private addActivityVRoot(readData: IScheduleEntity[] | ISmallActivityEntity[] | null | undefined) {
		const vRoot: ISmallActivityEntity = {
			Id: -1,
			Activities: [],
			ParentActivityFk: -1,
			HasChildren: readData && readData.length > 0,
		};
     if(readData){
		readData.forEach((item: IScheduleExtendedEntity) => {
			const activities = item.Activities ?? [];
			const schedule: ISmallActivityEntity = {
				Id: item.Schedule?.Id ?? 0,
				ScheduleFk: item.Schedule?.Id ?? 0,
				Code: item.Schedule?.Code ?? '',
				Description: item.Schedule?.DescriptionInfo ? item.Schedule?.DescriptionInfo.Translated : '',
				Activities: activities.sort((a, b) => {
					const codeA = a.Code ?? '';
					const codeB = b.Code ?? '';
					return codeA.localeCompare(codeB);
				}),
				//HasChildren: activities.length > 0 ?? false,
			};
			vRoot.Activities?.push(schedule);
		});
	}
		return vRoot;
	}

	/**
	 * Handles cell change functionality
	 */
	public cellChangeCallBack(item: IEstActivities, field: string) {
		if (field === 'Rule') {
			let ruleToDelete: IEstRuleEntity[]=[];
			if (item.Schedule?.IsRoot) {
				// TODO	ruleToDelete = inject(EstimateMainRootService).getRuleToDelete();
			} else {
				ruleToDelete = this.getRuleToDelete();
			}
			// TODO - PlatformDeleteSelectionDialogService,EstimateMainRootService
			if(item.Rule !== undefined){
			if(!item.Rule.length && ruleToDelete && ruleToDelete.length){
				this.messageBoxService.deleteSelectionDialog({ dontShowAgain: true, id:this.Id })?.then(result => {
					if (result.closingButtonId === 'yes' || result.closingButtonId === 'ok' ) {
						
						//inject(EstimateMainService).deleteParamByPrjRule(item, ruleToDelete, 'EstActivity');      
					}
				});

			}
		}
	
	}
}

	/**
	 * Delete Rule
	 * @param value Rule to delete
	 */
	public setRuleToDelete(value: IEstRuleEntity[]) {
		this.ruleToDelete = value;
	}

	/**
	 * Get Rule
	 */
	public getRuleToDelete() {
		return this.ruleToDelete;
	}

	/**
	 * Set filter
	 * @param projectId project id
	 */
	public setFilter(projectId: number) {
		return 'projectId=' + projectId;
	}

	// TODO Messanger service
	// public registerFilterActivityItem(callBackFn) {
	// 	this.filterActivityItem.register(callBackFn);
	// }

	// public unregisterFilterActivityItem(callBackFn) {
	// 	this.filterActivityItem.unregister(callBackFn);
	// }

	/**
	 * This function used in filtering the activities
	 * @param itemList list of activities
	 */
	public markersChanged(itemList:ISmallActivityEntity[]) {
		//const filterKey = 'PSD_ACTIVITY';
		// TODO let schedulingMainActivityTypes = inject(SchedulingMainActivityTypes);

		if (Array.isArray(itemList) && _.size(itemList) > 0) {
			//const allIds = [];
			itemList.forEach((item) => {
				// ActivityTypes: 1=(Regular)Activity, 2=SummaryActivity, 3=Milestone, 4=SubSchedule
				// if (item.ActivityTypeFk === schedulingMainActivityTypes.Activity || item.ActivityTypeFk === schedulingMainActivityTypes.SubSchedule) { // (Regular)Activity or Subschedule Activity
				// 	allIds.push(item.Id);
				// } else if (item.ActivityTypeFk === schedulingMainActivityTypes.SummaryActivity || item.ActivityTypeFk === undefined) { // SummaryActivity
				// 	// TODO get all child activities
				// 	// let items = estimateMainFilterCommon.collectItems(item, 'Activities');
				// 	// let Ids = _.map(_.filter(items, function (i) { return i.ActivityTypeFk === 1; }), 'Id');
				// 	// allIds = allIds.concat(Ids);
				// }
			});

			// TODO estimateMainFilterService
			// estimateMainFilterService.setFilterIds(filterKey, allIds);
			// estimateMainFilterService.addFilter('estimateMainActivityListController', service,
			// 	function (lineItem) {
			// 		return allIds.indexOf(lineItem.PsdActivityFk) >= 0;
			// 	},
			// 	{id: filterKey, iconClass: 'tlb-icons ico-filter-activity', captionId: 'filterActivity'},
			// 	'PsdActivityFk');
		} else {
			// TODO estimateMainFilterService
			// estimateMainFilterService.setFilterIds(filterKey, []);
			// estimateMainFilterService.removeFilter('estimateMainActivityListController');
		}

		// TODO this.filterActivityItem.fire();
	}

	/**
	 * Load Activities
	 * @param isFromNavigator string
	 */
	public loadActivity(isFromNavigator: string) {
		// if project id change, then reload leading structure
		const allList = this.getList();
		if (this.projectId !== this.contextService.getSelectedProjectId() || allList.length <= 0) {
			this.projectId = this.contextService.getSelectedProjectId();
			this.setFilter(this.projectId);
			if (this.projectId && !this.isReadData) {
				// TODO this.load();
			}
		} else {
			const rootItem = allList[0];
			if (rootItem) {
				const estHeader = this.contextService.getSelectedEstHeaderItem();
				if (estHeader) {
					rootItem.Code = estHeader.Code;
					rootItem.Description = estHeader.DescriptionInfo?.Translated;
					rootItem.EstHeaderFk = estHeader.Id;
				}
				// TODO this.fireItemModified(rootItem);
			}

			if (isFromNavigator === 'isForNagvitor') {
				// TODO this.load();
			}
		}
	}

	/**
	 * Used when new item is crated
	 * @param e Object from platform
	 * @param item Activity item
	 */
	public creatorItemChanged(e:object, item:ISmallActivityEntity) {
		if (!_.isEmpty(item)) {
			// TODO estimateMainCreationService
			// 	estimateMainCreationService.addCreationProcessor('estimateMainActivityListController', function (creationItem) {
			// 		// ActivityTypeFk, only assign Activities (Activity => ActivityTypeFk === 1)
			// 		if (item.ActivityTypeFk === 1) {
			// 			creationItem.PsdActivityFk = item.Id;
			// 			if(creationItem.DescStructure === 2 || !creationItem.validStructure || !creationItem.DescAssigned){
			// 				creationItem.DescriptionInfo = {
			// 					Description: item.Description,
			// 					DescriptionModified: false,
			// 					DescriptionTr: null,
			// 					Modified: false,
			// 					OtherLanguages: null,
			// 					Translated: item.Description,
			// 					VersionTr: 0
			// 				};
			// 				creationItem.DescAssigned = creationItem.DescStructure === 2;
			// 			}
			// 			// from structure
			// 			if(!creationItem.validStructure || creationItem.QtyTakeOverStructFk === 2){
			// 				creationItem.Quantity = item.Quantity;
			// 				creationItem.WqQuantityTarget = item.Quantity;
			// 				creationItem.WqQuantityTargetDetail = item.Quantity;
			// 				creationItem.QuantityTarget  = item.Quantity;
			// 				creationItem.QuantityTargetDetail= item.Quantity;
			// 				creationItem.BasUomTargetFk = creationItem.BasUomFk = item.QuantityUoMFk;
			// 				creationItem.validStructure = true;
			// 				creationItem.QtyTakeOverStructFk = 2;
			// 			}
			// 		}
			// 	});
			// }
			// else {
			// 	estimateMainCreationService.removeCreationProcessor('estimateMainActivityListController');
			// }
		}
	}
}
