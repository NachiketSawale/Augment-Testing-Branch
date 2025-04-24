/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupTypeLegacyDataService } from '@libs/ui/common';

import { IBasicsCustomizeDocumentTypeEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for BasicsSharedFileTypeLookupService.
 */

@Injectable({
	providedIn: 'root'
})

export class  BasicsSharedFileTypeLookupService<T extends object > extends UiCommonLookupTypeLegacyDataService<IBasicsCustomizeDocumentTypeEntity, T>  {

	public constructor() {
		super('documenttype', {
			uuid: 'df570c1bd6274072be06ec2386950b34',
			valueMember: 'Id',
			displayMember: 'Description',
		});
	}
}


