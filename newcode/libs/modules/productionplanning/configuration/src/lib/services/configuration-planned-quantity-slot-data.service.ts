/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IPpsPlannedQuantitySlotEntity } from '../model/entities/pps-planned-quantity-slot-entity.interface';
import { PpsPlannedQuantitySlotComplete } from '../model/pps-planned-quantity-slot-complete.class';


@Injectable({
	providedIn: 'root'
})

export class ConfigurationPlannedQuantitySlotDataService extends DataServiceFlatRoot<IPpsPlannedQuantitySlotEntity, PpsPlannedQuantitySlotComplete> {

	public constructor() {
		const options: IDataServiceOptions<IPpsPlannedQuantitySlotEntity> = {
			apiUrl: 'productionplanning/configuration/plannedquantityslot',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'customfiltered',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IPpsPlannedQuantitySlotEntity>>{
				role: ServiceRole.Root,
				itemName: 'PpsPlannedQuantitySlot',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IPpsPlannedQuantitySlotEntity | null): PpsPlannedQuantitySlotComplete {
		const complete = new PpsPlannedQuantitySlotComplete();
		if (modified !== null) {
			complete.PpsPlannedQuantitySlot = modified;
		}
		return complete;
	}

	public override getModificationsFromUpdate(complete: PpsPlannedQuantitySlotComplete): IPpsPlannedQuantitySlotEntity[] {
		if (complete.PpsPlannedQuantitySlot) {
			return [complete.PpsPlannedQuantitySlot];
		}
		return [];
	}
}












