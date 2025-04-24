/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityContainerBehavior, IEntityContainerLink } from '@libs/ui/business-base';
import { PpsMaintenanceDataService } from '../services/pps-maintenance-data.service';
import { PpsMaintenanceEntity } from '../model/entities/pps-maintenance-entity.class';

@Injectable({
	providedIn: 'root'
})
export class PpsMaintenanceFormBehavior implements IEntityContainerBehavior<IEntityContainerLink<PpsMaintenanceEntity>, PpsMaintenanceEntity> {
	public constructor(private dataService: PpsMaintenanceDataService) {
	}

	public onCreate() {
	}
}