/*
 * Copyright(c) RIB Software GmbH
 */

import { IDragDropData } from '@libs/ui/business-base';
import { DragDropActionType, DragDropConnection, IDragDropTarget } from '@libs/platform/common';
import { SchedulingMainDataService } from '../scheduling-main-data.service';
import { IActivityEntity } from '@libs/scheduling/interfaces';

export class SchedulingMainActivityRecordsConnection extends DragDropConnection<IActivityEntity, IActivityEntity> {

	private readonly activityListDataService: SchedulingMainDataService;

	public constructor(activityListDataService: SchedulingMainDataService) {
		super('0fcbaf8c89ac4493b58695cfa9f104e2', '0fcbaf8c89ac4493b58695cfa9f104e2');
		this.activityListDataService = activityListDataService;
	}

	public override canDrop(draggedDataInfo: IDragDropData<IActivityEntity>, dropTarget: IDragDropTarget<IActivityEntity>): boolean {
		return true;
	}

	public override drop(draggedData: IDragDropData<IActivityEntity>, dropTarget: IDragDropTarget<IActivityEntity>) {

		this.dropActivityRecord(draggedData, dropTarget);
	}

	public override allowedActionTypes(draggedDataInfo: IDragDropData<IActivityEntity> | null): DragDropActionType[] {
		return [DragDropActionType.Copy];
	}

	//TODO: needs to be implemented
	private dropActivityRecord(source: IDragDropData<IActivityEntity>, target: IDragDropTarget<IActivityEntity>): void {
		if (this.isActivitylist(target.id)) {
			if (Array.isArray(source.data) && target.data && target.data.length > 0) {
				source.data.forEach((sourceDataItem) => {
					this.activityListDataService.getCreatePayload(sourceDataItem, target.data![0], target.data![0].Id);
					//this.activityListDataService.canCreateChild();
					//this.activityListDataService.save();
				});
			}
		}
	}

	//ToDO: could be improved
	private isActivitylist(sourceOrTarget: string): boolean {
		return this.isOneOfType(sourceOrTarget, ['0fcbaf8c89ac4493b58695cfa9f104e2']);
	}

	//TODO: it may could be merged into isPlantEuroList()
	private isOneOfType(sourceOrTarget: string, types: string[]): boolean {
		const type = sourceOrTarget !== undefined && sourceOrTarget !== null ? sourceOrTarget : sourceOrTarget;
		return types.some(t => type === t);
	}
}