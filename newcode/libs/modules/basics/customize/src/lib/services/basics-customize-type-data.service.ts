/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions} from '@libs/platform/data-access';
import {BasicsCustomizeComplete} from '../model/entities/basics-customize-complete.class';
import {IBasicsCustomizeTypeEntity} from '../model/entities/basics-customize-type-entity.interface';

export const BASICS_CUSTOMIZE_TYPE_DATA_TOKEN = new InjectionToken<BasicsCustomizeTypeDataService>('basicsCustomizeTypeDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicsCustomizeTypeDataService extends DataServiceFlatRoot<IBasicsCustomizeTypeEntity, BasicsCustomizeComplete> {
	public constructor() {
		const options: IDataServiceOptions<IBasicsCustomizeTypeEntity> = {
			apiUrl: 'basics/customize/entitytype',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			roleInfo: <IDataServiceRoleOptions<IBasicsCustomizeTypeEntity>>{
				role: ServiceRole.Root,
				itemName: 'Type',
			},
		};

		super(options);
	}
	public override createUpdateEntity(modified: IBasicsCustomizeTypeEntity | null): BasicsCustomizeComplete {
		const complete = new BasicsCustomizeComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: BasicsCustomizeComplete): IBasicsCustomizeTypeEntity[] {
		return [];
	}

	public override supportsSidebarSearch(){
		return false;
	}
}
