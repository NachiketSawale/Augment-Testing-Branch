/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IHsqChkListTemplate2FormEntity } from '@libs/hsqe/interfaces';
import { BasicUserFormLookupService, Rubric } from '@libs/basics/shared';

/**  * The form layout service  */
@Injectable({ providedIn: 'root' })
export class ChecklistTemplateFormLayoutService {
	public generateLayout(): ILayoutConfiguration<IHsqChkListTemplate2FormEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: { key: 'cloud.common.entityProperties', text: 'Basic Data' },
					attributes: ['TemporaryCheckListId', 'Code', 'BasFormFk', 'Sorting', 'CommentText', 'DescriptionInfo'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('hsqe.checklisttemplate.', {
					TemporaryCheckListId: { key: 'entityChecklistId', text: 'CheckList Id' },
					BasFormFk: { key: 'entityBasForm', text: 'Form' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Code: { key: 'entityCode', text: 'Code' },
					Sorting: { key: 'entitySorting', text: 'Sorting' },
					CommentText: { key: 'entityCommentText', text: 'Comment' },
					DescriptionInfo: { key: 'entityDescription', text: 'Description' },
				}),
			},
			overloads: {
				BasFormFk: {
					type: FieldType.Lookup,
					width: 150,
					lookupOptions: createLookup({
						dataServiceToken: BasicUserFormLookupService,
						serverSideFilter: {
							key: '',
							execute() {
								return `rubricId=${Rubric.CheckList}`;
							},
						},
						showClearButton: true,
					}),
				},
			},
		};
	}
}
