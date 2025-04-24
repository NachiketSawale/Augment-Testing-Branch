/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { get } from 'lodash';
import { UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IUserFormEntity } from '../../model/entities/user-form-entity.interface';
import { IEntityContext } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})
export class BasicsSharedUserFormLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<IUserFormEntity, TEntity> {
	public constructor() {
		super({
			httpRead: {
				route: 'basics/userform/',
				endPointRead: 'list'
			},
			filterParam: 'rubricId',
			prepareListFilter: (context?: IEntityContext<TEntity>) => {
				return context ? 'rubricId=' + get(context.entity, 'RubricFk') : '';
			}
		}, {
			uuid: '00e7dc27279b47a1810479e9ecc7aafd',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
		});
	}
}