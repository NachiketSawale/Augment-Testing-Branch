/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';

import { IResourceEquipmentMaintenanceEntity } from '@libs/resource/interfaces';

import { ResourceEquipmentMaintenanceDataService } from '../services/data/resource-equipment-maintenance-data.service';


export const RESOURCE_EQUIPMENT_PLANT_MAINTENANCE_BEHAVIOR_TOKEN = new InjectionToken<ResourceEquipmentPlantMaintenanceBehavior>('resourceEquipmentPlantMaintenanceBehavior');

@Injectable({
	providedIn: 'root'
})
export class ResourceEquipmentPlantMaintenanceBehavior implements IEntityContainerBehavior<IGridContainerLink<IResourceEquipmentMaintenanceEntity>, IResourceEquipmentMaintenanceEntity> {

	private dataService: ResourceEquipmentMaintenanceDataService;


	public constructor() {
		this.dataService = inject(ResourceEquipmentMaintenanceDataService);
	}

	public onCreate(containerLink: IGridContainerLink<IResourceEquipmentMaintenanceEntity>): void {
		const dataSub = this.dataService.listChanged$.subscribe(data => {
			containerLink.gridData = data;
		});
		containerLink.registerSubscription(dataSub);
	}

}