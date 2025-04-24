/*
 * Copyright(c) RIB Software GmbH
 */

import {
	inject,
	Injectable
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { PlatformConfigurationService } from '@libs/platform/common';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {
	IPropertyKeyTagCategoryComplete,
	IPropertyKeyTagCategoryEntity,
	IPropertyKeyTagEntity
} from '../model/entities/entities';
import { ModelAdministrationPropertyKeyTagCategoryDataService } from './property-key-tag-category-data.service';

/**
 * The data service for the property key (attribute) tag entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationPropertyKeyTagDataService
	extends DataServiceFlatLeaf<IPropertyKeyTagEntity, IPropertyKeyTagCategoryEntity, IPropertyKeyTagCategoryComplete> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		const catSvc = inject(ModelAdministrationPropertyKeyTagCategoryDataService);

		super({
			apiUrl: 'model/administration/propkeytag',
			readInfo: {
				endPoint: 'list',
				prepareParam: () => {
					const selectedCategory = catSvc.getSelectedEntity();
					return {
						categoryId: selectedCategory?.Id ?? 0
					};
				}
			},
			createInfo: {
				prepareParam: () => {
					return {
						PKey: this.getSelectedEntity()?.Id ?? 0
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IPropertyKeyTagEntity, IPropertyKeyTagCategoryEntity, IPropertyKeyTagCategoryComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'PropertyKeyTags',
				parent: inject(ModelAdministrationPropertyKeyTagCategoryDataService)
			}
		});
	}

	private readonly httpClient = inject(HttpClient);

	private readonly configSvc = inject(PlatformConfigurationService);

	public override canCreate(): boolean {
		if (super.canCreate()) {
			const selItem = this.getSelectedEntity();
			if (selItem) {
				return selItem.Id > 0;
			}
		}

		return false;
	}

	/**
	 * Retrieves the display text for a set of property key tag IDs.
	 *
	 * @param tagIds The tag IDs.
	 *
	 * @returns A promise that is resolved to the user-friendly tag names.
	 */
	public async getDisplayTextForTagIds(tagIds: number[]): Promise<string> {
		const rawResult = await lastValueFrom(this.httpClient.get<string[]>(`${this.configSvc.webApiBaseUrl}model/administration/propkeytag/displaynames`, {
			params: {
				tagIds: tagIds.join(':')
			}
		}));

		return rawResult.join(', ');
	}
}
