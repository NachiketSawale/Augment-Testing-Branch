/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IPpsPhaseDateSlotEntity } from '../model/entities/pps-phase-date-slot-entity.interface';
import { PpsPhaseDateSlotComplete } from '../model/pps-phase-date-slot-complete.class';


@Injectable({
	providedIn: 'root'
})

export class ConfigurationPhaseDateSlotDataService extends DataServiceFlatRoot<IPpsPhaseDateSlotEntity, PpsPhaseDateSlotComplete> {

	public constructor() {
		const options: IDataServiceOptions<IPpsPhaseDateSlotEntity> = {
			apiUrl: 'productionplanning/configuration/phasedateslot',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IPpsPhaseDateSlotEntity>>{
				role: ServiceRole.Root,
				itemName: 'PpsPhaseDateSlot',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IPpsPhaseDateSlotEntity | null): PpsPhaseDateSlotComplete {
		const complete = new PpsPhaseDateSlotComplete();
		if (modified !== null) {
			complete.PpsPhaseDateSlot = modified;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: PpsPhaseDateSlotComplete): IPpsPhaseDateSlotEntity[] {
		if (complete.PpsPhaseDateSlot) {
			return [complete.PpsPhaseDateSlot];
		}
		return [];
	}
}












