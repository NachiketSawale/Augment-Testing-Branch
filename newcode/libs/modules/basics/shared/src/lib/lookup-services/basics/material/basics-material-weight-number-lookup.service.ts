/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { LookupSimpleEntity, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * Lookup for material weight number
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsMaterialWeightNumberLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<LookupSimpleEntity, TEntity> {
	/**
	 * The constructor
	 */
	public constructor(private translateService: PlatformTranslateService) {
		const items: LookupSimpleEntity[] = [
			new LookupSimpleEntity(0, translateService.instant('basics.material.lookup.kg').text),
			new LookupSimpleEntity(1, translateService.instant('basics.material.lookup.ton').text),
			new LookupSimpleEntity(2, translateService.instant('basics.material.lookup.g').text)
		];
		super(items, {uuid: '', displayMember: 'description', valueMember: 'id'});
	}
}