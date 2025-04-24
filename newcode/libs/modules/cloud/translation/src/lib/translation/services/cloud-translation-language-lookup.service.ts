/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { get } from 'lodash';

import { FieldType, ILookupSearchRequest, UiCommonLookupEndpointDataService } from '@libs/ui/common';

import { ILanguageTranslation } from '../model/entities/language-translation.interface';

/**
 * Cloud Translation Language Lookup Service Configuration
 */
@Injectable({
	providedIn: 'root',
})
export class CloudTranslationLanguageLookupService<TEntity extends object = object> extends UiCommonLookupEndpointDataService<ILanguageTranslation, TEntity> {
	public constructor() {
		super(
			{
				httpRead: { route: 'cloud/translation/language/', endPointRead: 'listLanguage' },
				filterParam: true,
				prepareListFilter: (context) => {
					return {
						PKey1: 573, // could be from entity context
					};
				},
			},
			{
				uuid: '6d23e282d14842cc8c77c57f1d759a60',
				valueMember: 'Id',
				displayMember: 'Description',
				gridConfig: {
					columns: [
						{
							id: 'Description',
							model: 'Description',
							type: FieldType.Description,
							label: { text: 'Description', key: 'cloud.common.entityDescription' },
							sortable: true,
							visible: true,
							readonly: true,
						},
					],
				},
			},
		);
	}

	protected override prepareSearchFilter(request: ILookupSearchRequest): string | object | undefined {
		const filterValue = get(request.additionalParameters, 'filterValue');

		return {
			PKey1: filterValue,
		};
	}
}
