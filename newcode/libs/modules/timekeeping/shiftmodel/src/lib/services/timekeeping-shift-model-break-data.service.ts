/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions, IEntityProcessor, EntityDateProcessorFactory } from '@libs/platform/data-access';
import { TimekeepingShiftModelWorkingTimeDataService } from './timekeeping-shift-model-working-time-data.service';
import { IShiftBreakEntity } from '../model/entities/shift-break-entity.interface';
import { WorkingTimeComplete } from '../model/entities/working-time-complete.class';
import { IShiftWorkingTimeEntity } from '../model/entities/shift-working-time-entity.interface';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingShiftModelBreakDataService extends DataServiceFlatLeaf<IShiftBreakEntity,
	IShiftWorkingTimeEntity, WorkingTimeComplete> {

	public constructor(timekeepingShiftModelWorkingTimeDataService : TimekeepingShiftModelWorkingTimeDataService) {
		const options: IDataServiceOptions<IShiftBreakEntity> = {
			apiUrl: 'timekeeping/shift/break',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					return {pKey1: ident.pKey1};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IShiftBreakEntity,
				IShiftWorkingTimeEntity, WorkingTimeComplete>> {
				role: ServiceRole.Leaf,
				itemName: 'Breaks',
				parent: timekeepingShiftModelWorkingTimeDataService
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

	public override isParentFn(parentKey: IShiftWorkingTimeEntity, entity: IShiftBreakEntity): boolean {
		return entity.ShiftWorkingtimeFk === parentKey.Id;
	}

	protected override provideAllProcessor(options: IDataServiceOptions<IShiftBreakEntity>): IEntityProcessor<IShiftBreakEntity>[] {
		const allProcessor = super.provideAllProcessor(options);
		allProcessor.push(this.provideDateProcessor());
		return allProcessor;
	}

	private provideDateProcessor(): IEntityProcessor<IShiftBreakEntity> {
		const dateProcessorFactory = inject(EntityDateProcessorFactory);
		return dateProcessorFactory.createProcessorFromSchemaInfo<IShiftBreakEntity>({ moduleSubModule: 'Timekeeping.ShiftModel', typeName: 'ShiftBreakDto' });
	}

}





