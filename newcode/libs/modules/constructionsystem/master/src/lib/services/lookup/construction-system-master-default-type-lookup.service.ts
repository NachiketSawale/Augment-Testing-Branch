/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { ICosDefaultTypeEntityEntity } from '../../model/models';

@Injectable({ providedIn: 'root' })
export class ConstructionSystemMasterDefaultTypeLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<ICosDefaultTypeEntityEntity, TEntity> {
	public constructor() {
		super('CosMasterDefaultType', {
			uuid: 'e02de9b51c97402ab425e33d4d1378ed',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
			showDialog: false,
		});
	}
}
