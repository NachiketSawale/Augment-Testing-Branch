/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICosWicEntity } from '../../model/entities/cos-wic-entity.interface';
import {
	ConstructionSystemMasterWicCatLookupService
} from '../lookup/construction-system-master-wiccat-lookup.service';
import {
	ConstructionSystemMasterBoqItemReferenceLookupService
} from '../lookup/construction-system-master-boq-item-reference-lookup.service';

/**
 * Wic layouts service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterWicLayoutService {
	public generateLayout(): ILayoutConfiguration<ICosWicEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['Code', 'CommentText', 'BoqItemFk', 'BoqWicCatBoqFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Code: {
						key: 'entityCode',
						text: 'Code',
					},
					CommentText: {
						key: 'entityCommentText',
						text: 'Comment',
					},
				}),
				...prefixAllTranslationKeys('constructionsystem.master.', {
					BoqItemFk: {
						key: 'entityBoqItemFk',
						text: 'BoqItem Reference',
					},
					BoqWicCatBoqFk: {
						key: 'entityBoqWicCatBoqFk',
						text: 'Boq Wic Cat Boq',
					},
				}),
			},
			overloads: {
				BoqItemFk: {
					// todo: BoqItemReference lookup, Parent-Child Grid Lookup Dialog,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemMasterBoqItemReferenceLookupService,
						displayMember: 'Reference'
					}),	//todo construction-system-master-wic-boq-item-lookup
					additionalFields: [
						{
							displayMember: 'BriefInfo.Translated',
							label: { key: 'constructionsystem.master.boqItemBrief' },
							column: true,
							singleRow: true,
						}
					]
				},
				BoqWicCatBoqFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemMasterWicCatLookupService,
						displayMember: 'WicBoqCat.Code',
					}),
					additionalFields: [
						{
							displayMember: 'WicBoqCat.DescriptionInfo.Translated',
							label: {
								key: 'constructionsystem.master.entityBoqWicCatDescription',
							},
							column: true,
							singleRow: true,
						},
					],
				},
			},
		};
	}
}
