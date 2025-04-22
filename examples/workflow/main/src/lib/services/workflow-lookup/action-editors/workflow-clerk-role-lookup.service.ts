/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupEndpointConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class WorkflowClerkRoleLookup<T extends object> extends UiCommonLookupEndpointDataService<T> {
	public constructor() {
		const lookupEndpointConfig: ILookupEndpointConfig<T, object> = {
			httpRead: { route: 'basics/customize/ClerkRole/', endPointRead: 'list', usePostForRead: true}
		};
		super(lookupEndpointConfig, {
			uuid: 'ee9f50d284b64120b367df5d094d0eb1',
			displayMember: 'DescriptionInfo.Translated',
			valueMember: 'Id'
		});
	}
}