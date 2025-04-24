/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IShiftEntity } from '../model/entities/shift-entity.interface';
import { ShiftComplete } from '../model/entities/shift-complete.class';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingShiftModelDataService extends DataServiceFlatRoot<IShiftEntity, ShiftComplete> {

	public constructor() {
		const options: IDataServiceOptions<IShiftEntity> = {
			apiUrl: 'timekeeping/shiftmodel',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IShiftEntity>>{
				role: ServiceRole.Root,
				itemName: 'Shifts',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IShiftEntity | null): ShiftComplete {
		const complete = new ShiftComplete(null);
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Shifts = modified;
		}

		return complete;
	}
	public override getModificationsFromUpdate(complete: ShiftComplete): IShiftEntity[] {
		return complete.Shifts ? [complete.Shifts] : [];
	}

	public getProcessors() {
		return this.processor.getProcessors();
	}
}







