/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';

import { BasicsUnitEntity } from '../model/basics-unit-entity.class';
import { BasicsUnitComplete } from '../model/basics-unit-complete.class';


@Injectable({
	providedIn: 'root',
})
export class BasicsUnitDataService extends DataServiceFlatRoot<BasicsUnitEntity, BasicsUnitComplete> {
	public constructor() {
		const options: IDataServiceOptions<BasicsUnitEntity> = {
			apiUrl: 'basics/unit',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<BasicsUnitEntity>>{
				role: ServiceRole.Root,
				itemName: 'defaultItemName',
			},
		};

		super(options);
	}

	public override createUpdateEntity(modified: BasicsUnitEntity | null): BasicsUnitComplete {
		const complete = new BasicsUnitComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Uom = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: BasicsUnitComplete): BasicsUnitEntity[] {
		if (complete.Uom === null) {
			complete.Uom = [];
		}

		return complete.Uom;
	}
}
