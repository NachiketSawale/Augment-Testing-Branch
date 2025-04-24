/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IActivityEntity, IActivityRelationshipEntity } from '@libs/scheduling/interfaces';
import { ActivityComplete } from '../model/activity-complete.class';
import { SchedulingMainDataService } from './scheduling-main-data.service';
import { IIdentificationData, PlatformHttpService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import * as _ from 'lodash';

export interface IReadData {
	filter: number[];
}
export interface RelationshipResponse {
	data: IActivityRelationshipEntity[];
}
export interface IData {
	itemList: IActivityRelationshipEntity[];
}
export interface ICreateMultipleResponse {
		Activities: IActivityEntity[];
		RelationshipsToSave: IActivityRelationshipEntity[];
}

@Injectable({
	providedIn: 'root'
})

export class SchedulingMainRelationshipAllService extends DataServiceFlatLeaf<IActivityEntity, IActivityEntity, ActivityComplete> {
	private readonly http = inject(PlatformHttpService);
	private readonly uiCommonMsgBoxService = inject(UiCommonMessageBoxService);
	public createPredeccessorRequested = false;
	private itemList: IActivityRelationshipEntity[] = [];
	public mainItemId: number = 0;
	public childFk: number = 0;

	public constructor(private schedulingMainService: SchedulingMainDataService) {
		const options: IDataServiceOptions<IActivityRelationshipEntity> = {
			apiUrl: 'scheduling/main/relationship',
			roleInfo: <IDataServiceChildRoleOptions<IActivityRelationshipEntity,IActivityEntity,ActivityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Relationships',
				parent: schedulingMainService
			},
			createInfo: {
				prepareParam: (ident) => {
					return {
						MainItemId: ident.id,
						...(ident.pKey1 !== undefined && { ScheduleId: ident.pKey1 }),
						ChildItemId: ident.id
					};
				}
			}
		};

		super(options);
	}

	public getActivityIds(readData: IReadData): void {
		const immediateresult = this.schedulingMainService.getList();
		if (!immediateresult || immediateresult.length === 0) {
			readData.filter = [-1]; // Workaround for empty request
			return;
		}
		const result = _.compact(immediateresult.map(item => item.Id));
		readData.filter = result;
	}

	protected override onCreateSucceeded(creationData: ActivityComplete): IActivityEntity {
		const newItem = creationData.RelationshipsToSave?.[0];
		const act = this.schedulingMainService.getSelection()[0];
		if (newItem) {
			if (!this.createPredeccessorRequested) {
				newItem.PredecessorCode = act?.Code;
				newItem.PredecessorDesc = act?.Description;
				if (act?.Schedule) {
					newItem.PredecessorSchedule = act.Schedule.Code;
				}
			} else {
				if (creationData.MainItemId) {
					creationData.MainItemId = 0; // Set the property to undefined
				}
				newItem.SuccessorCode = act?.Code;
				newItem.SuccessorDesc = act?.Description;
				if (act?.Schedule) {
					newItem.SuccessorSchedule = act.Schedule.Code;
				}
			}

			if (creationData.Activities) {
				creationData.Activities.forEach((activity: IActivityEntity) => {
					this.schedulingMainService.mergeInActivityChange(activity);
				});
				this.takeOverMoreActivities(creationData.RelationshipsToSave ?? [], creationData.Activities);
				// TODO schedulingMainService.gridRefresh();
			}

			return newItem as IActivityEntity; // Cast or transform to IActivityEntity if possible
		}
		// Handle the case where `newItem` is undefined, if necessary
		throw new Error('No new item created'); // Example error handling
	}

	public takeOverMoreActivities(relationshipsToSave: IActivityRelationshipEntity[], activities: IActivityEntity[]): void {
		this.schedulingMainService.takeOverActivities(activities, true);
		relationshipsToSave.forEach((relation: IActivityRelationshipEntity) => {
			this.itemList.push(relation);
		});
		this.onDataFilterChanged();
	}

	public onDataFilterChanged(): void {
		// TODO serviceContainer.data.listLoaded.fire();
	}

	public deleteRelationship(entity: IActivityRelationshipEntity, data: IData): Promise<void> {
		return this.deleteRelations([entity], data);
	}

	public deleteRelations(entities: IActivityRelationshipEntity[], data: IData): Promise<void> {
		//TODO need to migrate the platformDataServiceEntityRoleExtension

		// return platformDataServiceEntityRoleExtension.deleteSubEntities(entities, service, data).then(() => {
		// 	const withSuccessors = _.filter(entities, r => this.relationShipHasBothActivitiesAssigned(r));
		// 	if (_.isEmpty(withSuccessors)) {
		// 		return true;
		// 	}

		//   TODO need to migrate executeCompleteCommand of scheduling main data service
		// 	return this.schedulingMainService.executeCompleteCommand({
		// 		MainItemId: withSuccessors[0].ParentActivityFk,
		// 		EntitiesCount: 1,
		// 		RelationshipsToDelete: withSuccessors,
		// 		PostProcess: {
		// 			Action: 19,
		// 			EffectedItemId: withSuccessors[0].ParentActivityFk
		// 		}
		// 	});
		// });
		return Promise.resolve(); // Keep it as a resolved Promise<void> for now
	}

	public deleteRelationships(entities: IActivityRelationshipEntity[], data: IData): Promise<void> {
		return this.deleteRelations(entities, data);
	}

	public relationShipHasBothActivitiesAssigned(rel: IActivityRelationshipEntity): boolean {
		return !_.isNil(rel.ParentActivityFk) && rel.ParentActivityFk !== 0 && !_.isNil(rel.ChildActivityFk) && rel.ChildActivityFk !== 0;
	}

	public createPredecessor(mainItemId: number): Promise<void> {
		this.createPredeccessorRequested = true;
		this.mainItemId = mainItemId;
		// TODO return service.createItem();
		return Promise.resolve(); // Placeholder
	}

	public createSuccessor(childFk: number): Promise<void> {
		this.createPredeccessorRequested = false;
		this.childFk = childFk;
		// TODO return service.createItem();
		return Promise.resolve(); // Placeholder
	}

	public loadAllRelationships(): Promise<void> {
		// TODO serviceContainer.data;
		const data = { itemList: this.itemList };
		const readData = { filter: [] };

		this.getActivityIds(readData);

		return this.http.post<RelationshipResponse>('scheduling/main/relationship/listall', readData)
			.then((response) => this.onReadAllRelationshipsSucceeded(response.data, data));
	}

	public onReadAllRelationshipsSucceeded(result: IActivityRelationshipEntity[], data: IData): void {
		data.itemList.length = 0;
		result.forEach((entity) => {
			if(entity.ChildActivityFk!==undefined && entity.ChildActivityFk!==null){
				this.schedulingMainService.processActivity(entity.ChildActivityFk);
				this.itemList.push(entity);
			}
		});
		//TODO: <platformDataServiceDataProcessorExtension> missing
		// platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);
		// data.listLoaded.fire(result);
	}

	public addRelationships(): Promise<void> {
		const selectedEntities = this.schedulingMainService.getSelection();
		if (!Array.isArray(selectedEntities) || selectedEntities.length < 2) {
			 this.uiCommonMsgBoxService.showInfoBox('scheduling.main.selectMultiple', 'info', true);
			 return Promise.resolve();
		}
		const itemIds = selectedEntities.map((entity: IActivityEntity) => entity.Id);
		const scheduleId = selectedEntities[0]?.ScheduleFk;
		const relationKind = 1; // default is finish-start

		return this.http.post<ICreateMultipleResponse>('scheduling/main/relationship/createmultiple', {
				ItemIds: itemIds,
				ScheduleId: scheduleId,
				RelationshipTypeFk: relationKind,
			})
			.then((response) => {
				this.schedulingMainService.takeOverActivities(response.Activities, true);
				this.takeOverMoreActivities(response.RelationshipsToSave, response.Activities);
				this.takeOverRelations(response.RelationshipsToSave);
			});
	}

	public takeOverRelations(relations: IActivityRelationshipEntity[]): void {
		relations.forEach((rel:IActivityRelationshipEntity) => {
			this.itemList.push(rel);
		});
		this.onDataFilterChanged();
	}

	public override loadSubEntities(identificationData: IIdentificationData | null): Promise<void> {
		return Promise.resolve();
	}
}