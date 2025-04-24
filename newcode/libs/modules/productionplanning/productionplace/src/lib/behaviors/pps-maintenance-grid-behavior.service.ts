/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { PpsMaintenanceEntity } from '../model/entities/pps-maintenance-entity.class';
import { PpsMaintenanceDataService } from '../services/pps-maintenance-data.service';


@Injectable({
	providedIn: 'root'
})
export class PpsMaintenanceGridBehavior implements IEntityContainerBehavior<IGridContainerLink<PpsMaintenanceEntity>, PpsMaintenanceEntity> {


	public constructor(private dataService: PpsMaintenanceDataService) {
	}
	public onCreate(containerLink: IGridContainerLink<PpsMaintenanceEntity>): void {}
}
