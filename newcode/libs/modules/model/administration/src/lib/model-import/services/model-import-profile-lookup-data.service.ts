/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { INamedItemEntityWithId } from '@libs/platform/common';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';

/**
 * A lookup data service for model import profiles.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationModelImportProfileLookupDataService<T extends object> extends UiCommonLookupEndpointDataService<INamedItemEntityWithId<number>, T> {

	public constructor() {
		super({
			httpRead: {
				route: 'model/administration/importprf',
				endPointRead: 'listforlookup'
			},
			dataProcessors: [{
				processItem: item => item.SimpleId = item.Id.Id
			}]
		}, {
			uuid: '559c465eaf8647a3955b0708f2b4edcb',
			displayMember: 'DescriptionInfo.Translated',
			valueMember: 'SimpleId'
		});
	}
}
