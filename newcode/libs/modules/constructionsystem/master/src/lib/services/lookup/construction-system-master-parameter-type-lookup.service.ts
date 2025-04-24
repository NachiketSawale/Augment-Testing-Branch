/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IEntityIdentification } from '@libs/platform/common';
import { UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';

interface IParameterTypeEntity extends IEntityIdentification {
	Description?: string;
}

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterParameterTypeLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<IParameterTypeEntity, TEntity> {
	/**
	 * constructor
	 */
	public constructor() {
		super('CosMasterParameterType', {
			uuid: '70b3de78e9e14a3086e75ef782e4ac62',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Description',
			showDialog: false,
		});
	}
}
