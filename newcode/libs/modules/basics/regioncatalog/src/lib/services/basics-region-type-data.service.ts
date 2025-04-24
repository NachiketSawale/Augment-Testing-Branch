/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';

import { BasicsRegionTypeEntity } from '../model/basics-region-type-entity.class';
import { BasicsRegionTypeComplete } from '../model/basics-region-type-complete.class';
import { isNil } from 'lodash';


@Injectable({
	providedIn: 'root',
})
export class BasicsRegionTypeDataService extends DataServiceFlatRoot<BasicsRegionTypeEntity, BasicsRegionTypeComplete> {
	public constructor() {
		const options: IDataServiceOptions<BasicsRegionTypeEntity> = {
			apiUrl: 'basics/regionCatalog/regionType',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceRoleOptions<BasicsRegionTypeEntity>>{
				role: ServiceRole.Root,
				itemName: 'RegionType',
			},
		};

		super(options);
	}
	public override createUpdateEntity(modified: BasicsRegionTypeEntity | null): BasicsRegionTypeComplete {
		const complete = new BasicsRegionTypeComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Datas = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: BasicsRegionTypeComplete): BasicsRegionTypeEntity[] {
		if (isNil(complete.Datas)) {
			complete.Datas = [];
		}

		return complete.Datas;
	}
}
