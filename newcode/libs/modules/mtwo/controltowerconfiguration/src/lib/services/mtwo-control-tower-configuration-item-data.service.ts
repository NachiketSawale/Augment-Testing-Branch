/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceHierarchicalNode, IDataServiceRoleOptions, ServiceRole, IDataServiceEndPointOptions, IDataServiceOptions } from '@libs/platform/data-access';

import { MtwoControlTowerConfigurationDataService } from './mtwo-control-tower-configuration-data.service';
import { IMtwoPowerbiEntity, IMtwoPowerbiItemEntity, MtwoPowerbiComplete } from '@libs/mtwo/interfaces';


/**
 * Represent Mtwo Control Tower Configuration Item Data Service
 */
@Injectable({
	providedIn: 'root',
})
export class MtwoControlTowerConfigurationItemDataService extends DataServiceHierarchicalNode< IMtwoPowerbiItemEntity, MtwoControlTowerConfigurationDataService, IMtwoPowerbiEntity, MtwoPowerbiComplete> {
	public constructor(private mtwoControlTowerConfigurationService: MtwoControlTowerConfigurationDataService) {
		const options: IDataServiceOptions<IMtwoPowerbiItemEntity> = {
			apiUrl: 'mtwo/controltower/powerbiitem',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						mainItemId: ident.pKey1!
					};
				}
			},
			roleInfo: <IDataServiceRoleOptions<IMtwoPowerbiItemEntity>>{
				role: ServiceRole.Node,
				itemName: 'MtoPowerbiitem',
				parent: mtwoControlTowerConfigurationService,
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};

		super(options);
	}

	public override childrenOf(element: IMtwoPowerbiItemEntity): IMtwoPowerbiItemEntity[] {
		return element.ChildItems ?? [];
	}

	public override parentOf(element: IMtwoPowerbiItemEntity): IMtwoPowerbiItemEntity | null {
		if (element.Groupid == null) {
			return null;
		}
		const parentId = element.Groupid;
		const parent = this.flatList().find(candidate => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}
}
