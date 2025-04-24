/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { IBasicsClerkComplete, IBasicsClerkEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root',
})
export class BasicsClerkDataService extends DataServiceFlatRoot<IBasicsClerkEntity, IBasicsClerkComplete> {
	public constructor() {
		const options: IDataServiceOptions<IBasicsClerkEntity> = {
			apiUrl: 'basics/clerk',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listfiltered',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceRoleOptions<IBasicsClerkEntity>>{
				role: ServiceRole.Root,
				itemName: 'Clerk',
			},
			processors: []
		};

		super(options);
	}

	public override createUpdateEntity(modified: IBasicsClerkEntity | null): IBasicsClerkComplete {
		return {
			MainItemId:  modified?.Id,
			Clerk: modified ?? null,
		} as IBasicsClerkComplete;
	}

	public override getModificationsFromUpdate(complete: IBasicsClerkComplete): IBasicsClerkEntity[] {
		if (complete.Clerk === null) {
			return [];
		}

		return [complete.Clerk];
	}

	public getProcessors() {
		return this.processor.getProcessors();
	}
}
