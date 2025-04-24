/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IHsqCheckList2FormEntity } from '@libs/hsqe/interfaces';
import { HsqeChecklistUserFormLookupService } from '../hsqe-checklist-user-form-lookup.service';

/**
 * The meeting layout service
 */
@Injectable({
	providedIn: 'root',
})
export class HsqeChecklistFormDataLayoutService {
	public generateLayout(): ILayoutConfiguration<IHsqCheckList2FormEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['FormFk', 'Code', 'DescriptionInfo'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('hsqe.checklist.', {
					FormFk: { key: 'form.userForm', text: 'User Form' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode', text: 'Code' },
					DescriptionInfo: { key: 'entityDescription', text: 'Description' },
				}),
			},
			overloads: {
				FormFk: { type: FieldType.Lookup, lookupOptions: createLookup({ dataServiceToken: HsqeChecklistUserFormLookupService }) },
			},
		};
	}
}
