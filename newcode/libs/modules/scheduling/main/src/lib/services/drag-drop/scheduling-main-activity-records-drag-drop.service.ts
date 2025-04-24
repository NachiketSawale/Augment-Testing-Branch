/*
 * Copyright(c) RIB Software GmbH
 */

import { IDragDropData } from '@libs/ui/business-base';
import { Injectable } from '@angular/core';
import { DragDropBase } from '@libs/platform/common';
import { IActivityEntity } from '@libs/scheduling/interfaces';
import { SchedulingMainDataService } from '../scheduling-main-data.service';

@Injectable({
	providedIn: 'root'
})
export class SchedulingMainActivityRecordsDragDropService extends DragDropBase<IActivityEntity> {
	private readonly activityListDataService: SchedulingMainDataService;

	public constructor(activityListDataService: SchedulingMainDataService) {
		super('13120439d96c47369c5c24a2df29238d');
		this.activityListDataService = activityListDataService;
	}

	public override canDrag(draggedDataInfo: IDragDropData<IActivityEntity> | null): boolean {
		return true;
	}

}