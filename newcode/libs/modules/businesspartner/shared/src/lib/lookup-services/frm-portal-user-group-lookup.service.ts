/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { IBasicsCustomizeFrmPortalUserGroupEntity } from '@libs/basics/interfaces';

/**
 * Lookup Service for IBasicsCustomizeFrmPortalUserGroupEntity.
 */

@Injectable({
	providedIn: 'root'
})

export class  FrmPortalUserGroupLookupService<T extends object = object> extends UiCommonLookupEndpointDataService<IBasicsCustomizeFrmPortalUserGroupEntity, T>  {
	public constructor() {
		super({
			httpRead: { route: 'basics/customize/frmportalusergroup', endPointRead: 'list', usePostForRead: true }
		}, {
			uuid: '0aff01d3ea3641aea4e3b32f94009670',
			valueMember: 'Id',
			displayMember: 'Name',			
		});
	}
}
