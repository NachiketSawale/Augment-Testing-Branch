/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { IDraggedDataInfo, DragDropBase, DragDropConnection } from '@libs/platform/common';
import { SchedulingMainActivityRecordsConnection } from './scheduling-main-activity-records-connection.class';
import { SchedulingMainDataService } from '../scheduling-main-data.service';
import { IActivityEntity } from '@libs/scheduling/interfaces';
import { SchedulingMainSourceContainerRecordsConnection } from './scheduling-main-source-container-records-connection.class';

@Injectable({
	providedIn: 'root'
})
export class SchedulingMainActivityDragDropService extends DragDropBase<IActivityEntity> {

	private readonly schedulingMainDataService = inject(SchedulingMainDataService);

	public constructor() {
		super('0fcbaf8c89ac4493b58695cfa9f104e2');
	}

	public override get dragDropConnections(): DragDropConnection<object, IActivityEntity>[] {
		return [
			new SchedulingMainActivityRecordsConnection(this.schedulingMainDataService),
			new SchedulingMainSourceContainerRecordsConnection(this.schedulingMainDataService),
		] as DragDropConnection<object, IActivityEntity>[];
	}

	public override canDrag(draggedDataInfo: IDraggedDataInfo<IActivityEntity> | null) {
		return true;
	}

}