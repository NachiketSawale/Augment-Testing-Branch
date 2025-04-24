/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import _ from 'lodash';

import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';

import { IMtwoPowerbiItemEntity, IMtwoPowerbiEntity, MtwoPowerbiComplete } from '@libs/mtwo/interfaces';

import { MtwoControlTowerUserDataService } from './mtwo-control-tower-user-data.service';

/**
 * Mtwo Control Tower Pro Reports Data Service.
 */

@Injectable({
	providedIn: 'root',
})
export class MtwoControlTowerProReportsDataService extends DataServiceFlatLeaf<IMtwoPowerbiItemEntity, IMtwoPowerbiEntity, MtwoPowerbiComplete> {
	public constructor(private mtwoControlTowerUserListDataService: MtwoControlTowerUserDataService) {
		const options: IDataServiceOptions<IMtwoPowerbiItemEntity> = {
			apiUrl: 'mtwo/controltower/powerbiitem',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getfiltered_reportitemlist',
				usePost: true,
			},
			roleInfo: <IDataServiceChildRoleOptions<IMtwoPowerbiItemEntity, IMtwoPowerbiEntity, MtwoPowerbiComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Name',
				parent: mtwoControlTowerUserListDataService,
			},
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		const selected = this.mtwoControlTowerUserListDataService.getSelectedEntity();
		return {
			Id: selected?.Id,
			Authorized: selected?.Authorized,
			filter: '',
		};
	}

	protected override onLoadSucceeded(loaded: object): IMtwoPowerbiItemEntity[] {
		if (loaded) {
			return _.get(loaded, 'data', []);
		}
		return [];
	}
}
