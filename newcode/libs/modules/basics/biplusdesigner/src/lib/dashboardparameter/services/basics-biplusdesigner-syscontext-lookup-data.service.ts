/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { LookupSimpleEntity, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * Lookup for Dashboard Parameter SysContext
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsBiPlusDesignerSysContextLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<LookupSimpleEntity, TEntity> {
	/**
	 * The constructor
	 */
	public constructor(private translateService: PlatformTranslateService) {
		const items: LookupSimpleEntity[] = [
			new LookupSimpleEntity(0, translateService.instant('basics.biplusdesigner.syscontextNull').text),
			new LookupSimpleEntity(1, translateService.instant('basics.biplusdesigner.syscontextCompany').text),
			new LookupSimpleEntity(2, translateService.instant('basics.biplusdesigner.syscontextProfitCenter').text),
			new LookupSimpleEntity(3, translateService.instant('basics.biplusdesigner.syscontextProject').text),
			new LookupSimpleEntity(4, translateService.instant('basics.biplusdesigner.syscontextMainEntityId').text),
			new LookupSimpleEntity(5, translateService.instant('basics.biplusdesigner.syscontextMainEntityIdArray').text),
			new LookupSimpleEntity(6, translateService.instant('basics.biplusdesigner.syscontextUserId').text),
			new LookupSimpleEntity(7, translateService.instant('basics.biplusdesigner.syscontextUserName').text),
			new LookupSimpleEntity(8, translateService.instant('basics.biplusdesigner.syscontextUserDescription').text),
			new LookupSimpleEntity(9, translateService.instant('basics.biplusdesigner.syscontextSelectedMainEntities').text),
		];
		super(items, { uuid: '', displayMember: 'description', valueMember: 'id' });
	}
}
