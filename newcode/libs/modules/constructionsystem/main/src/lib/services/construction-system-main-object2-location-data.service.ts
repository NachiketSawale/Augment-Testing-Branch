/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';

import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IModelObject2LocationEntity } from '../model/entities/model-object2-location-entity.interface';
import { IInstance2ObjectEntity } from '@libs/constructionsystem/shared';
import { Instance2ObjectComplete } from '../model/entities/instance-2-object-complete.class';
import { ConstructionSystemMainInstance2ObjectDataService } from './construction-system-main-instance2-object-data.service';
import { IProjectLocationEntity } from '@libs/project/interfaces';
import { PlatformHttpService, ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMainInstanceDataService } from './construction-system-main-instance-data.service';
import { ProjectLocationLookupService } from '@libs/project/shared';

export const CONSTRUCTION_SYSTEM_MAIN_OBJECT2_LOCATION_DATA_TOKEN = new InjectionToken<ConstructionSystemMainObject2LocationDataService>('constructionSystemMainObject2LocationDataToken');

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainObject2LocationDataService extends DataServiceFlatLeaf<IModelObject2LocationEntity, IInstance2ObjectEntity, Instance2ObjectComplete> {
	private readonly instanceService = ServiceLocator.injector.get(ConstructionSystemMainInstanceDataService);
	private readonly projectLocationService = ServiceLocator.injector.get(ProjectLocationLookupService);
	private readonly http = inject(PlatformHttpService);
	public constructor(private parentService: ConstructionSystemMainInstance2ObjectDataService) {
		const options: IDataServiceOptions<IModelObject2LocationEntity> = {
			apiUrl: 'model/main/object2location',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
			},
			roleInfo: <IDataServiceChildRoleOptions<IModelObject2LocationEntity, IInstance2ObjectEntity, Instance2ObjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ModelObject2Locations',
				parent: parentService,
			},
			entityActions: { createSupported: true, deleteSupported: true },
		};
		super(options);
		this.subscriptToParentSelectedChange();
	}

	private getParentSelected() {
		return this.parentService.getSelectedEntity();
	}
	protected override provideLoadPayload(): object {
		const parentSelected = this.getParentSelected();
		return {
			objectId: parentSelected?.ObjectFk ?? 0,
			modelId: parentSelected?.ModelFk ?? 0,
		};
	}
	protected override provideCreatePayload(): object {
		const parentSelected = this.getParentSelected();
		return {
			PKey1: parentSelected?.ObjectFk ?? 0,
			PKey2: parentSelected?.ModelFk ?? 0,
		};
	}

	protected override onCreateSucceeded(created: IModelObject2LocationEntity) {
		return created;
	}
	protected override onLoadSucceeded(loaded: IModelObject2LocationEntity[]): IModelObject2LocationEntity[] {
		const projectId = this.instanceService.getCurrentSelectedProjectId();
		const locationIds = this.projectLocationService.cache
			.getList()
			.filter((s) => s.ProjectFk === projectId)
			.map((e) => e.Id);
		if (locationIds.length === 0) {
			return loaded;
		} else {
			return loaded.filter((item) => locationIds.includes(item.LocationFk));
		}
	}

	private getProjectLocations(locationItems: IProjectLocationEntity[]): IProjectLocationEntity[] {
		let newItems: IProjectLocationEntity[] = [];
		locationItems.forEach((item) => {
			if (item.Locations?.length > 0) {
				newItems = newItems.concat(this.getProjectLocations(item.Locations));
			}
			newItems.push(item);
		});
		return newItems;
	}

	public async saveModelObject2Location(items: IModelObject2LocationEntity[]) {
		const http = this.http;
		const promises = items.map(function (item) {
			return http.post('model/main/object2location/save', item);
		});
		await Promise.all(promises).then(() => {
			this.reloadData();
		});
	}

	public async deleteModelObject2Location(items: IModelObject2LocationEntity[]) {
		await this.http.post$('model/main/object2location/multidelete', items);
		this.reloadData();
	}

	private subscriptToParentSelectedChange() {
		this.parentService.selectionChanged$.subscribe(() => {
			const modifiedItems = this.getModified();
			const deletedItems = this.getDeleted();
			if (modifiedItems.length > 0) {
				this.saveModelObject2Location(modifiedItems);
			}
			if (deletedItems.length > 0) {
				this.deleteModelObject2Location(deletedItems);
			}
			this.clearModifications();
		});
	}
	private reloadData() {
		const parentSelected = this.getParentSelected();
		if (parentSelected) {
			const ident = this.parentService.convertSelectedToIdentification(parentSelected);
			this.loadSubEntities(ident);
		}
	}
}
