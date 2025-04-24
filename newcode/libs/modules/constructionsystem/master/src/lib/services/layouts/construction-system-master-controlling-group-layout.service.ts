/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { createLookup, FieldOverloadSpec, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedMdcControllingGroupLookupService } from '@libs/basics/shared';
import { ICosControllingGroupEntity } from '../../model/entities/cos-controlling-group-entity.interface';
import { SchedulingControllingGroupDetailLookup } from '@libs/scheduling/shared';

/**
 * The construction system master controlling group layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMasterControllingGroupLayoutService {
	public generateLayout(): ILayoutConfiguration<ICosControllingGroupEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: { key: 'cloud.common.entityProperties', text: 'Basic Data' },
					attributes: ['Code', 'CommentText', 'MdcControllingGroupFk', 'MdcControllingGroupDetailFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('constructionsystem.master.', {
					MdcControllingGroupFk: {
						key: 'entityMdcControllingGroupFk',
						text: 'Controlling Group',
					},
					MdcControllingGroupDetailFk: {
						key: 'entityMdcControllingGroupDetailFk',
						text: 'Controlling Group Detail',
					},
				}),
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
			},
			overloads: {
				MdcControllingGroupFk: this.provideMdcControllingGroupFkOverload(),
				MdcControllingGroupDetailFk: this.provideMdcControllingGroupDetailFkOverload(),
			},
		};
	}

	private provideMdcControllingGroupFkOverload(): FieldOverloadSpec<ICosControllingGroupEntity> {
		return {
			type: FieldType.Lookup,
			readonly: false,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMdcControllingGroupLookupService,
				displayMember: 'DescriptionInfo.Translated',
				showClearButton: false,
				gridConfig: {
					columns: [
						{
							id: 'Code',
							model: 'Code',
							type: FieldType.Code,
							label: { key: 'cloud.common.entityIcon' },
							sortable: true,
							visible: true,
							readonly: true,
							width: 50,
						},
						{
							id: 'DescriptionInfo',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: { key: 'cloud.common.entityDescription' },
							sortable: true,
							visible: true,
							readonly: true,
							width: 300,
						},
					],
				},
			}),
			additionalFields: [
				{
					displayMember: 'Code',
					label: { key: 'cloud.common.entityIcon' },
					column: true,
					singleRow: true,
				},
			],
		};
	}

	private provideMdcControllingGroupDetailFkOverload(): FieldOverloadSpec<ICosControllingGroupEntity> {
		return {
			type: FieldType.Lookup,
			readonly: false,
			lookupOptions: createLookup({
				dataServiceToken: SchedulingControllingGroupDetailLookup,
				showClearButton: false,
				gridConfig: {
					columns: [
						{
							id: 'Code',
							model: 'Code',
							type: FieldType.Code,
							label: { key: 'cloud.common.entityCode' },
							sortable: true,
							visible: true,
							readonly: true,
						},
						{
							id: 'DescriptionInfo',
							model: 'DescriptionInfo',
							type: FieldType.Translation,
							label: { key: 'cloud.common.entityDescription' },
							sortable: true,
							visible: true,
							readonly: true,
						},
					],
				},
				clientSideFilter: {
					execute(item, context): boolean {
						return context.entity.MdcControllingGroupFk === item.ControllinggroupFk;
					},
				},
			}),
			additionalFields: [
				{
					displayMember: 'DescriptionInfo.Translated',
					label: { key: 'cloud.common.descriptionInfo' },
					column: true,
					singleRow: true,
				},
			],
		};
	}
}
