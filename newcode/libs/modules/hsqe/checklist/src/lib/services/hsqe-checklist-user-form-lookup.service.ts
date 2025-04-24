/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IUserFormEntity, Rubric } from '@libs/basics/shared';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HsqeChecklistUserFormLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IUserFormEntity, TEntity> {
	public constructor() {
		super(
			{
				httpRead: { route: 'basics/userform/', endPointRead: 'list', usePostForRead: false },
				filterParam: true,
				prepareListFilter: () => {
					return `rubricId=${Rubric.CheckList}`;
				},
			},
			{ uuid: '', valueMember: 'Id', displayMember: 'DescriptionInfo.Translated' },
		);
	}
}
