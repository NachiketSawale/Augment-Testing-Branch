/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IActivityEntity, IEventEntity } from '@libs/scheduling/interfaces';
import { ActivityComplete } from '../model/activity-complete.class';
import { SchedulingMainDataService } from './scheduling-main-data.service';
import { PlatformHttpService } from '@libs/platform/common';
import * as _ from 'lodash';

export interface IReadData {
	filter: number[];
}

@Injectable({
	providedIn: 'root'
})

export class SchedulingMainEventAllService extends DataServiceFlatLeaf<IEventEntity, IActivityEntity, ActivityComplete> {
	private readonly http = inject(PlatformHttpService);
	private itemList: IEventEntity[] = [];
	private deleteItems: IEventEntity[] = [];

	public constructor(private schedulingMainService: SchedulingMainDataService) {
		const options: IDataServiceOptions<IEventEntity> = {
			apiUrl: 'scheduling/main/event/listall',
			roleInfo: <IDataServiceChildRoleOptions<IEventEntity, IActivityEntity, ActivityComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Events',
				parent: schedulingMainService
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create',
				usePost: true,
				prepareParam: (ident) => {
					const selection = this.schedulingMainService.getSelectedEntity();
					if(selection){
						return {
							PKey1: selection.Id,
							PKey2: selection.ScheduleFk
						};
					}
					return {
						PKey1: null,
						PKey2: null
					};
				}
			},
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

	public loadAllEvents(): Promise<void> {
		// TODO serviceContainer.data;
		//TODO this.schedulingMainEventTypeService.assertEventTypes();
		const readData:IReadData = {filter: []};

		this.getActivityIds(readData);

		return this.http.post('scheduling/main/event/listall', readData)
			.then((response: unknown) => {
				let eventList = response as IEventEntity[]; // Cast the response to IEventEntity[]
				if (this.itemList.length > 0) {
					_.forEach(this.itemList, (eve) => {
						const myEve: IEventEntity| undefined = _.find(eventList, (item) => item.Id === eve.Id);
						if (myEve) {
							myEve.Date = eve.Date;
							myEve.DistanceTo = eve.DistanceTo;
						} else {
							eventList.push(eve);
						}
					});
					this.itemList = [];
				}

				if (this.deleteItems.length > 0) {
					eventList = _.filter(eventList, (item) =>
						!_.find(this.deleteItems, (entity) => entity.Id === item.Id)
					);
					this.deleteItems = [];
				}
				this.onLoadSucceeded(eventList);
			});

	}

	public updateEvents(events: IEventEntity[]): void {
		let hasToFire = false;
		const list = this.getList();
		events.forEach((eve: IEventEntity) => {
			const myEve: IEventEntity| undefined = list.find(a => a.Id = eve.Id);
			if (myEve) {
				myEve.Date = eve.Date;
				myEve.DistanceTo = eve.DistanceTo;
				//TODO platformDataServiceDataProcessorExtension.doProcessItem(myEve, serviceContainer.data);
				this.setModified(myEve);
				if (myEve.Version === 0) {
					hasToFire = true;
				}
			} else {
				if (this.itemList.length === 0) {
					this.itemList.push(eve);
				}

				//this.itemList.push(eve);
				this.setModified(eve);
				// TODO platformDataServiceDataProcessorExtension.doProcessItem(eve, serviceContainer.data);
				hasToFire = true;
			}
		});

		if (hasToFire) {
			//TODO serviceContainer.data.listLoaded.fire();
		}
	}

	public getFilteredList(): IEventEntity[] {
		let result: IEventEntity[] = [];
		const selectedItem = this.schedulingMainService.getSelectedEntity();
		if (selectedItem && selectedItem.Id) {
			result = this.itemList.filter((item: IEventEntity) => item.ActivityFk === selectedItem.Id);
		}

		return result;
	}

	public listLoaded() {
		this.loadAllEvents();
	}

	public moveItem(entities: IEventEntity[]): void {
		entities.forEach((entity: IEventEntity) => {
			this.itemList = this.itemList.filter((item: IEventEntity) => item.Id !== entity.Id);
		});

		this.listLoaded();
	}


	public takeOverEvents(events: IEventEntity[]): void {
		const toDo = events.filter((rel: IEventEntity) =>
			!this.itemList.some((item: IEventEntity) => item.Id === rel.Id)
		);
		let fireListLoaded = false;

		toDo.forEach((eve: IEventEntity) => {
			this.itemList.push(eve);
			if (eve.Version === 0) {
				this.setModified(eve);
			}
			fireListLoaded = true;
		});

		if (fireListLoaded) {
			this.onDataFilterChanged();
		}
	}

	public onDataFilterChanged() {
		this.listLoaded();
	}

	public deleteEvents(entities: IEventEntity[]): IEventEntity[] {
		if (this.itemList.length === 0) {
			entities.forEach((eve: IEventEntity) => {
				this.deleteItems.push(eve);
			});
		}
		if (this.itemList.length > 0) {
			this.itemList = this.itemList.filter((item: IEventEntity) =>
				!entities.some((entity: IEventEntity) => entity.Id === item.Id)
			);
		}
		return entities;
		//TODO return platformDataServiceEntityRoleExtension.deleteSubEntities(entities, service, data);
	}

	public createNewItem(): Promise<IEventEntity> {
		return this.create().then((newItem: IEventEntity) => {
			this.itemList.push(newItem);
			return newItem;
		});
	}

	public override canCreate(): boolean {
		return !this.schedulingMainService.isCurrentTransientRoot();
	}

	protected override onLoadSucceeded(loaded: IEventEntity[]): IEventEntity[] {
		return loaded;
	}
}