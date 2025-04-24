/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { get } from 'lodash';
import { ILookupContext, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { SubsidiaryStatusEntity } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root'
})
export class BusinesspartnerSharedSubsidiaryStatusLookupService<TEntity extends object> extends UiCommonLookupTypeDataService<SubsidiaryStatusEntity, TEntity> {
	public constructor() {
		super('subsidiarystatus', {
			uuid: '2949360d6df24fbc97a7ffb81a5d73aa',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			showCustomInputContent: true,
			formatter: { // TODO: Use the global status icon formatter instead.
				format(dataItem: SubsidiaryStatusEntity, context: ILookupContext<SubsidiaryStatusEntity, TEntity>): string {
					return `<i class='block-image status-icons ico-status${dataItem.Icon.toString().padStart(2, '0')}'></i><span class='pane-r'>${get(dataItem, context.lookupConfig.displayMember)}</span>`;
				}
			}
		});
	}
}