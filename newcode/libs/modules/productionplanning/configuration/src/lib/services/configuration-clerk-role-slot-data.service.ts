/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot, IDataServiceEndPointOptions, IDataServiceOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';


import { ClerkRoleSlotComplete } from '../model/clerk-role-slot-complete.class';
import { IClerkRoleSlotEntity } from '../model/entities/clerk-role-slot-entity.interface';


@Injectable({
	providedIn: 'root'
})

export class ConfigurationClerkRoleSlotDataService extends DataServiceFlatRoot<IClerkRoleSlotEntity, ClerkRoleSlotComplete> {

	public constructor() {
		const options: IDataServiceOptions<IClerkRoleSlotEntity> = {
			apiUrl: 'productionplanning/configuration/clerkroleslot',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IClerkRoleSlotEntity>>{
				role: ServiceRole.Root,
				itemName: 'ClerkRoleSlot',
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IClerkRoleSlotEntity | null): ClerkRoleSlotComplete {
		const complete = new ClerkRoleSlotComplete();
		if (modified !== null) {
			complete.ClerkRoleSlot = modified;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: ClerkRoleSlotComplete): IClerkRoleSlotEntity[] {
		if (complete.ClerkRoleSlot) {
			return [complete.ClerkRoleSlot];
		}
		return [];
	}
}












