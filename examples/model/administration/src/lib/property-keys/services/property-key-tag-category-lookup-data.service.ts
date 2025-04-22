/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IGridConfiguration, UiCommonLookupEndpointDataService } from '@libs/ui/common';
import { IPropertyKeyTagCategoryEntity } from '../model/entities/property-key-tag-category-entity.interface';
import { PROPERTY_KEY_TAG_CATEGORY_ENTITY_INFO } from '../model/property-key-tag-category-entity-info.model';

/**
 * A lookup data service for property key tag categories.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationPropertyKeyTagCategoryLookupDataService
	extends UiCommonLookupEndpointDataService<IPropertyKeyTagCategoryEntity> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super({
			httpRead: {
				route: 'model/administration/propkeytagcat/',
				endPointRead:'list'
			}
		}, {
			uuid: '5d5c988bfe3c42e680b0fbf9f946a6f4',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			gridConfig: async ctx => {
				const cols = await PROPERTY_KEY_TAG_CATEGORY_ENTITY_INFO.generateLookupColumns(ctx.injector);

				return <IGridConfiguration<IPropertyKeyTagCategoryEntity>>{
					columns: cols
				};
			},
			treeConfig: {
				parent: item => item.PropertyKeyTagParentCategoryEntity ?? null,
				children: item => item.PropertyKeyTagChildCategoryEntities ?? [],
				parentMember: 'PropertyKeyTagParentCategoryFk'
			}
		});
	}
}