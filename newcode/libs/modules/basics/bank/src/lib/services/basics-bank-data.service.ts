/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatRoot, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions} from '@libs/platform/data-access';
import { BasicsBankEntity } from '../model/basics-bank-entity.class';
import { BasicsBankComplete } from '../model/basics-bank-complete.class';

export const BASICS_BANK_DATA_TOKEN = new InjectionToken<BasicsBankDataService>('basicsBankDataToken');

@Injectable({
	providedIn: 'root',
})
export class BasicsBankDataService extends DataServiceFlatRoot<BasicsBankEntity, BasicsBankComplete> {
	public constructor() {
		const options: IDataServiceOptions<BasicsBankEntity> = {
			apiUrl: 'basics/bank',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listfiltered',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceRoleOptions<BasicsBankEntity>>{
				role: ServiceRole.Root,
				itemName: 'Bank',
			},
		};

		super(options);
	}
	public override createUpdateEntity(modified: BasicsBankEntity | null): BasicsBankComplete {
		const complete = new BasicsBankComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Bank = modified;
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: BasicsBankComplete): BasicsBankEntity[] {
		if (complete.Bank === null) {
			return [];
		}

		return [complete.Bank];
	}
}
