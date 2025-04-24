/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
/* it's useless, to be deleted in the future
import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { PpsHeader2BpDataService } from './pps-header2bp-data.service';
import {
	PpsCommonBizPartnerComplete,
	IPpsCommonBizPartnerEntity,
	IPpsCommonBizPartnerContactEntity,
} from '@libs/productionplanning/common';

@Injectable({
	providedIn: 'root'
})
export class PpsHeader2BpContactDataService extends DataServiceFlatLeaf<IPpsCommonBizPartnerContactEntity, IPpsCommonBizPartnerEntity, PpsCommonBizPartnerComplete> {

	public constructor(private parentService: PpsHeader2BpDataService) {
		const options: IDataServiceOptions<IPpsCommonBizPartnerContactEntity> = {
			apiUrl: 'productionplanning/common/contact',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => ({mainItemId: ident.pKey1})
			},
			roleInfo: <IDataServiceChildRoleOptions<IPpsCommonBizPartnerContactEntity, IPpsCommonBizPartnerEntity, PpsCommonBizPartnerComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'CommonBizPartnerContact',
				parent: parentService,
			},
		};

		super(options);
	}

}
*/