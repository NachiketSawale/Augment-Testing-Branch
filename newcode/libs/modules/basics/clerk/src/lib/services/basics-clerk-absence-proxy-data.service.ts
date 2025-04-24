/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { BasicsClerkAbsenceDataService } from './basics-clerk-absence-data.service';
import { IBasicsClerkAbsenceProxyEntity, IBasicsClerkAbsenceEntity, IBasicsClerkAbsenceComplete } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root',
})
export class BasicsClerkAbsenceProxyDataService extends DataServiceFlatLeaf<IBasicsClerkAbsenceProxyEntity, IBasicsClerkAbsenceEntity, IBasicsClerkAbsenceComplete> {
	public constructor() {
		const options: IDataServiceOptions<IBasicsClerkAbsenceProxyEntity> = {
			apiUrl: 'basics/clerk/absenceproxy',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					return {
						PKey1 : ident.pKey1,
						PKey2 : ident.pKey2};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IBasicsClerkAbsenceProxyEntity, IBasicsClerkAbsenceEntity, IBasicsClerkAbsenceComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ClerkAbsenceProxies',
				parent: inject(BasicsClerkAbsenceDataService),
			},
		};

		super(options);
	}

	public override isParentFn(parentKey: IBasicsClerkAbsenceEntity, entity: IBasicsClerkAbsenceProxyEntity): boolean {
		return entity.ClerkAbsenceFk === parentKey.Id;
	}

}
