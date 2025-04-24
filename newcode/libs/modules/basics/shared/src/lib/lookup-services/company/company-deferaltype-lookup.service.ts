/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';
import { ICompanyDeferaltypeLookupEntity } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root',
})
export class BasicsSharedCompanyDeferaltypeLookupService<TEntity extends object> extends UiCommonLookupTypeLegacyDataService<ICompanyDeferaltypeLookupEntity, TEntity> {
	public constructor() {
		super('companydeferaltype', {
			uuid: 'f505600af006f446b13a6d68e85e3952',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Description',
		});
	}
}
