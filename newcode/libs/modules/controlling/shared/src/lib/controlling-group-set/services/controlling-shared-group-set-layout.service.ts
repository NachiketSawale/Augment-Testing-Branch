/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedMdcControllingGroupDetailLookupService, BasicsSharedMdcControllingGroupLookupService } from '@libs/basics/shared';
import { IBasicsCustomizeMdcControllingGroupDetailEntity } from '@libs/basics/interfaces';
import { IControllingUnitdGroupSetEntity } from '@libs/controlling/interfaces';

/**
 * Controlling Shared Group Set layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ControllingSharedGroupSetLayoutService {
	public async generateLayout<T extends IControllingUnitdGroupSetEntity>() {
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['ControllinggroupFk', 'ControllinggroupdetailFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('controlling.structure.', {
					ControllinggroupFk: { key: 'entityControllinggroupFk' },
					ControllinggroupdetailFk: { key: 'entityControllinggroupdetailFk' },
				}),
			},
			overloads: {
				ControllinggroupFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({ dataServiceToken: BasicsSharedMdcControllingGroupLookupService }),
					additionalFields: [
						{
							displayMember: 'DescriptionInfo.Translated',
							label: {
								key: 'controlling.structure.entityControllinggroupDescription',
							},
							column: true,
							singleRow: true,
						},
					],
				},
				ControllinggroupdetailFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedMdcControllingGroupDetailLookupService,
						clientSideFilter: {
							execute(item: IBasicsCustomizeMdcControllingGroupDetailEntity, context: ILookupContext<IBasicsCustomizeMdcControllingGroupDetailEntity, IControllingUnitdGroupSetEntity>): boolean {
								return item.ControllinggroupFk === context.entity?.ControllinggroupFk;
							},
						},
					}),
					additionalFields: [
						{
							displayMember: 'DescriptionInfo.Translated',
							label: {
								key: 'controlling.structure.entityControllinggroupdetailDescription',
							},
							column: true,
							singleRow: true,
						},
						{
							displayMember: 'CommentText',
							label: {
								key: 'controlling.structure.entityControllinggroupdetailComment',
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
