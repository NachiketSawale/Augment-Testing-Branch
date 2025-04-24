/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	DataServiceFlatRoot,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	IDataServiceRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { IPpsHeaderEntity } from '@libs/productionplanning/shared';
import { PpsHeaderComplete } from '../model/pps-header-complete.class';

@Injectable({ providedIn: 'root' })
export class PpsHeaderDataService extends DataServiceFlatRoot<IPpsHeaderEntity, PpsHeaderComplete> {
	public constructor() {
		const options: IDataServiceOptions<IPpsHeaderEntity> = {
			apiUrl: 'productionplanning/header',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyfiltered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			updateInfo: <IDataServiceEndPointOptions>{
				endPoint: 'update'
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'create'
			},
			roleInfo: <IDataServiceRoleOptions<IPpsHeaderEntity>>{
				role: ServiceRole.Root,
				itemName: 'PPSHeaders'
			}
		};
		super(options);
	}

	public override createUpdateEntity(modified: IPpsHeaderEntity | null): PpsHeaderComplete {
		const complete = new PpsHeaderComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.PPSHeaders = [modified];
		} else if (this.hasSelection()) { // fix issue that missing initializing MainItemId(MainItemId is 0) when only updating Header2Clerk/CommonBizPartner/... properties
			complete.MainItemId = this.getSelection()[0].Id;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: PpsHeaderComplete): IPpsHeaderEntity[] {
		if (complete.PPSHeaders === null) {
			complete.PPSHeaders = [];
		}

		return complete.PPSHeaders;
	}

}
