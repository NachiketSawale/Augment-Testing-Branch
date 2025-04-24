/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { LookupSimpleEntity, UiCommonLookupItemsDataService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * Lookup for Report Parameter SysContext
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsReportingSysContextLookupService<TEntity extends object> extends UiCommonLookupItemsDataService<LookupSimpleEntity, TEntity> {
	public constructor(private translateService: PlatformTranslateService) {
		const items: LookupSimpleEntity[] = [
            //new LookupSimpleEntity(null, translateService.instant('basics.reporting.contextNull').text), //TODO: The 'id' in LookupSimpleEntity should not accept null.
			new LookupSimpleEntity(0, translateService.instant('basics.reporting.syscontextNull').text),
			new LookupSimpleEntity(1, translateService.instant('basics.reporting.syscontextCompany').text),
			new LookupSimpleEntity(2, translateService.instant('basics.reporting.syscontextProfitCenter').text),
			new LookupSimpleEntity(3, translateService.instant('basics.reporting.syscontextProjekt').text),
			new LookupSimpleEntity(4, translateService.instant('basics.reporting.syscontextMainEntityId').text),
			new LookupSimpleEntity(5, translateService.instant('basics.reporting.syscontextMainEntityIdArray').text),
			new LookupSimpleEntity(6, translateService.instant('basics.reporting.syscontextUserId').text),
			new LookupSimpleEntity(7, translateService.instant('basics.reporting.syscontextUserName').text),
			new LookupSimpleEntity(8, translateService.instant('basics.reporting.syscontextUserDescription').text),
			new LookupSimpleEntity(9, translateService.instant('basics.reporting.syscontextSelectedMainEntities').text),
            new LookupSimpleEntity(10, translateService.instant('basics.reporting.syscontextWatchList').text),
            new LookupSimpleEntity(11, translateService.instant('basics.reporting.syscontextDialogSection').text),
		];
		super(items, { uuid: '', displayMember: 'description', valueMember: 'id' });
	}
}