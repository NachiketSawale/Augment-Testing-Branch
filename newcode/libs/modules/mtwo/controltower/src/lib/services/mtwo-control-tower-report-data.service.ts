/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IMtwoPowerbiItemEntity, MtwoControlTowerReportComplete, IMtwoPowerbiEntity, MtwoPowerbiComplete } from '@libs/mtwo/interfaces';

import { MtwoControlTowerUserDataService } from './mtwo-control-tower-user-data.service';

/**
 * Mtwo Control Tower Report Data Service
 */
@Injectable({
	providedIn: 'root'
})
export class MtwoControlTowerReportDataService extends DataServiceFlatNode<IMtwoPowerbiItemEntity, MtwoControlTowerReportComplete, IMtwoPowerbiEntity, MtwoPowerbiComplete>{

	public constructor(private mtwoControlTowerUserListDataService:MtwoControlTowerUserDataService) {
		const options: IDataServiceOptions<IMtwoPowerbiItemEntity>  = {
			apiUrl: 'mtwo/controltower/powerbiitem',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'getreportitemlist',
				usePost: false,
				prepareParam: (ident) => {
                    return {
                        mainItemId: ident.pKey1,
                    };
                },
			},
			roleInfo: <IDataServiceChildRoleOptions<IMtwoPowerbiItemEntity,IMtwoPowerbiEntity, MtwoPowerbiComplete>>{
				role: ServiceRole.Node,
				itemName: 'Name',
				parent: mtwoControlTowerUserListDataService,
			},
			entityActions: {
                deleteSupported: false,
                createSupported: false
            }
		};

		super(options);
	}
	
}

		
			





