/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceChildRoleOptions, DataServiceFlatNode, IEntityProcessor, EntityDateProcessorFactory } from '@libs/platform/data-access';
import { TimekeepingShiftModelDataService } from './timekeeping-shift-model-data.service';
import { IShiftWorkingTimeEntity } from '../model/entities/shift-working-time-entity.interface';
import { WorkingTimeComplete } from '../model/entities/working-time-complete.class';
import { ShiftComplete } from '../model/entities/shift-complete.class';
import { IShiftEntity } from '../model/entities/shift-entity.interface';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingShiftModelWorkingTimeDataService extends DataServiceFlatNode<IShiftWorkingTimeEntity,
	WorkingTimeComplete, IShiftEntity, ShiftComplete> {
	public constructor(timekeepingShiftModelDataService : TimekeepingShiftModelDataService) {
		const options: IDataServiceOptions<IShiftWorkingTimeEntity> = {
			apiUrl: 'timekeeping/shiftModel/workingTime',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IShiftWorkingTimeEntity,
				IShiftEntity, ShiftComplete>> {
				role: ServiceRole.Node,
				itemName: 'WorkingTimes',
				parent: timekeepingShiftModelDataService
			}
		};

		super(options);
	}
	protected override provideCreatePayload(): object {
		const parent = this.getSelectedParent()!;
		return {
			PKey1: parent.Id,
		};
	}
	public override createUpdateEntity(modified: IShiftWorkingTimeEntity | null): WorkingTimeComplete {
		return new WorkingTimeComplete(modified);
	}

	public override registerByMethod(): boolean {
		return true;
	}
	public override registerNodeModificationsToParentUpdate(complete: ShiftComplete, modified: WorkingTimeComplete[], deleted: IShiftWorkingTimeEntity[]) {
		if (modified && modified.length > 0) {
			complete.WorkingTimesToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.WorkingTimesToDelete = deleted;
		}
	}
	public override getSavedEntitiesFromUpdate(complete: ShiftComplete): IShiftWorkingTimeEntity[] {
		return (complete && complete.WorkingTimesToSave)
			? complete.WorkingTimesToSave.map(e => e.WorkingTimes!)
			: [];
	}

	public override isParentFn(parentKey: ShiftComplete, entity: IShiftWorkingTimeEntity): boolean {
		return entity.ShiftFk === parentKey.MainItemId;
	}

	protected override provideAllProcessor(options: IDataServiceOptions<IShiftWorkingTimeEntity>): IEntityProcessor<IShiftWorkingTimeEntity>[] {
		const allProcessor = super.provideAllProcessor(options);
		allProcessor.push(this.provideDateProcessor());
		return allProcessor;
	}

	private provideDateProcessor(): IEntityProcessor<IShiftWorkingTimeEntity> {
		const dateProcessorFactory = inject(EntityDateProcessorFactory);
		return dateProcessorFactory.createProcessorFromSchemaInfo<IShiftWorkingTimeEntity>({ moduleSubModule: 'Timekeeping.ShiftModel', typeName: 'ShiftWorkingTimeDto' });
	}
}





