/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions} from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IDataServiceOptions } from '@libs/platform/data-access';
import { ITimekeepingSettlementComplete } from '../model/timekeeping-settlement-complete.class';
import { ITimekeepingSettlementEntity } from '@libs/timekeeping/interfaces';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingSettlementDataService extends DataServiceFlatRoot<ITimekeepingSettlementEntity, ITimekeepingSettlementComplete> {
	public constructor() {
		const options: IDataServiceOptions<ITimekeepingSettlementEntity> = {
			apiUrl: 'timekeeping/settlement',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<ITimekeepingSettlementEntity>>{
				role: ServiceRole.Root,
				itemName: 'Settlement'
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: ITimekeepingSettlementEntity | null): ITimekeepingSettlementComplete {
		const complete = new ITimekeepingSettlementComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Settlement = [modified];
		}

		return complete;
	}
	public override getModificationsFromUpdate(complete: ITimekeepingSettlementComplete) {
		if (complete.Settlement === null) {
			complete.Settlement = [];
		}

		return complete.Settlement;
	}

}
