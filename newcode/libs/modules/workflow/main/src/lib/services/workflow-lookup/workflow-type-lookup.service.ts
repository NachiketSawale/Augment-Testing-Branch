/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILookupConfig, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IWorkflowType } from '@libs/workflow/shared';

/**
 * Lookup used for retrieve type of workflow
 */
@Injectable({
	providedIn: 'root'
})
export class WorkflowTypeLookup<TEntity extends object> extends UiCommonLookupEndpointDataService<IWorkflowType, TEntity> {

	public constructor() {
		const endpoint = { httpRead: { route: 'basics/workflow/type/', endPointRead: 'list' } };
		const config: ILookupConfig<IWorkflowType, TEntity> = {
			uuid: 'f3d3564f76984723b5bafbd8a81dfdd4',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo',
			formatter: {
				format(dataItem, context) {
					 return dataItem.DescriptionInfo.Translated;
				},
			},
			clientSideFilter: {
				execute(item, context) {
					 return item.IsLive;
				},
			}
		};
		super(endpoint, config);
	}
}