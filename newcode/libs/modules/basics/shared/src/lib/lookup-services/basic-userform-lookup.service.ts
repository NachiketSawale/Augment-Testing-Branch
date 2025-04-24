/*
 * Copyright(c) RIB Software GmbH
 */

import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IDescriptionInfo} from '@libs/platform/common';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BasicUserFormLookupService<TEntity extends object> extends UiCommonLookupEndpointDataService<IUserformEntity, TEntity>{

	public constructor() {
		super({
			httpRead: {
				route: 'basics/userform/',
				endPointRead: 'list',
				usePostForRead: false,
			},
			prepareSearchFilter: request => {
				let filterString = request.filterString;
				if(filterString){
					filterString = filterString.replace('(','').replace(')', '');
				}
				return filterString || '';
			}
		}, {
			uuid: '880e5970dd164454939495d9fa75658B',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated'
		});
	}
}

export interface IUserformEntity {
	Id: number;
	RubricFk: number;
	DescriptionInfo ?: IDescriptionInfo
}