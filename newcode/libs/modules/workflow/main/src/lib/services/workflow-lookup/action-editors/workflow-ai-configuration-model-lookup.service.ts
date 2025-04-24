/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupEndpointConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';

@Injectable({
	providedIn: 'root'
})
export class WorkflowAiConfigurationModelLookup<T extends object> extends UiCommonLookupEndpointDataService<T> {
	public constructor() {
		const lookupEndpointConfig: ILookupEndpointConfig<T, object> = {
			httpRead: { route: 'mtwo/aiconfiguration/model/', endPointRead: 'all'}
		};
		super(lookupEndpointConfig, {
			uuid: 'ee9f50d284b64120b367df5d094d0ec1',
			displayMember: 'Code',
			valueMember: 'Id'
		});
	}
}