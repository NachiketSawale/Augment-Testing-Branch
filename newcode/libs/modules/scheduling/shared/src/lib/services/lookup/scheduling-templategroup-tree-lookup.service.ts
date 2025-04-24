
/*
 * Copyright(c) RIB Software GmbH
 */


import { Injectable } from '@angular/core';
import { ILookupEndpointConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { ISchedulingTemplateGroupTree } from '../../model/interfaces/scheduling-templategroup-tree.interface';

/**
 * Lookup used to popupate escalation workflows.
 */
@Injectable({
	providedIn: 'root'
})
export class SchedulingTemplategroupTreeLookup<T extends object> extends UiCommonLookupEndpointDataService<ISchedulingTemplateGroupTree, T> {
	public constructor() {
		const lookupEndpointConfig: ILookupEndpointConfig<ISchedulingTemplateGroupTree, T> = {
			httpRead: { route: 'scheduling/template/activitytemplategroup/', endPointRead: 'tree' }
		};
		super(lookupEndpointConfig, {
			uuid: '7cd59eeebb434679a39b5b29de0507b2',
			displayMember: 'Code',
			valueMember: 'Id'
		});
	}
}