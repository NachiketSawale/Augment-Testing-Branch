/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	createLookup,
	FieldType,
	ILayoutConfiguration,
	ILookupContext,
	LookupImageIconType,
	LookupSvgBgColorType
} from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {
	BasicsSharedCoSysTypeLookupService,
	BasicsSharedLookupOverloadProvider,
	BasicsSharedRubricCategoryLookupService,
	BasicUserFormLookupService,
	IUserformEntity,
	Rubric
} from '@libs/basics/shared';
import { ICosHeaderEntity } from '../../model/entities/cos-header-entity.interface';
import {
	ConstructionSystemSharedGroupComboboxLookupService
} from '../lookup/construction-system-shared-group-combobox-lookup.service';
import { IBasicsCustomizeRubricCategoryEntity } from '@libs/basics/interfaces';
import { IBasicsCustomizeCoSysTypeEntity } from '@libs/basics/interfaces';

/**
 * The construction system master header layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemSharedHeaderLayoutService {
	public generateLayout(): ILayoutConfiguration<ICosHeaderEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: { key: 'cloud.common.entityProperties', text: 'Basic Data' },
					attributes: [
						'RubricCategoryFk',
						'Code',
						'Reference',
						'CosGroupFk',
						'IsChecked',
						'CosTemplateFk',
						'CosTypeFk',
						'MatchCode',
						'CommentText',
						'IsLive',
						'StructureFk',
						'IsDistinctInstances',
						'DescriptionInfo',
						'ChangeOption.IsCopyLineItems',
						'ChangeOption.IsMergeLineItems',
						'ChangeOption.IsChange',
					],
				},
				{
					gid: 'form',
					title: { key: 'constructionsystem.master.entityBasFormFk', text: 'Form' },
					attributes: ['BasFormFk'],
				},
				{
					gid: 'changeOption',
					title: { key: 'constructionsystem.master.chgOptionGridContainerTitle', text: 'Change Option' },
					attributes: ['ChangeOption.IsCopyLineItems', 'ChangeOption.IsMergeLineItems', 'ChangeOption.IsChange'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('constructionsystem.master.', {
					MatchCode: { key: 'entityMatchCode', text: 'Match Code' },
					IsDistinctInstances: { key: 'entityIsDistinctInstances', text: 'Is Distinct Instances' },
					BasFormFk: { key: 'entityBasFormFk', text: 'Form' },
					'ChangeOption.IsCopyLineItems': { key: 'entityIsCopyLineItems', text: 'Is Copy Line Items' },
					'ChangeOption.IsMergeLineItems': { key: 'entityIsMergeLineItems', text: 'Is Merge Line Items' },
					'ChangeOption.IsChange': { key: 'entityIsChange', text: 'Is Change' },
				}),
				...prefixAllTranslationKeys('basics.common.', {
					StructureFk: { key: 'entityPrcStructureFk', text: 'Procurement Structure' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					RubricCategoryFk: { key: 'entityBasRubricCategoryFk', text: 'Category' },
					Code: { key: 'entityCode', text: 'Code' },
					Reference: { key: 'entityReference', text: 'Reference' },
					CosGroupFk: { key: 'entityGroup', text: 'Group' },
					CosTypeFk: { key: 'entityType', text: 'Type' },
					CommentText: { key: 'entityCommentText', text: 'Comment' },
					IsLive: { key: 'entityIsLive', text: 'Active' },
					DescriptionInfo: { key: 'entityDescription', text: 'Description' },
				}),
			},
			overloads: {
				Code: {
					type: FieldType.Code,
					readonly: true,
				},
				IsLive: { readonly: true, visible: true },
				CosTypeFk: {
					// todo-allen: display svg format icon.
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedCoSysTypeLookupService,
						showGrid: false,
						imageSelector: {
							select(item: IBasicsCustomizeCoSysTypeEntity, context: ILookupContext<IBasicsCustomizeCoSysTypeEntity, ICosHeaderEntity>): string {
								return item.Icon ? `type-icons ico-construction${item.Icon.toString().padStart(2, '0')}` : '';
							},
							getIconType(): LookupImageIconType | string {
								return LookupImageIconType.Css; //todo:lius it not work! seems to request url error (cloud.style)
							},
							svgConfig: {
								backgroundColor: 'white',
								backgroundColorType: LookupSvgBgColorType.String,
								backgroundColorLayer: [1],
							},
						},
					}),
					readonly: true,
				},
				BasFormFk: {
					type: FieldType.Lookup,
					readonly: false,
					width: 150,
					lookupOptions: createLookup({
						dataServiceToken: BasicUserFormLookupService,
						clientSideFilter: {
							execute(item: IUserformEntity, context: ILookupContext<IUserformEntity, ICosHeaderEntity>): boolean {
								return item.RubricFk === 60;
							},
						},
						displayMember: 'DescriptionInfo.Translated',
						serverSideFilter: {
							key: '',
							execute() {
								return `rubricId=${Rubric.ConstructionSystems}`;
							},
						},
						showClearButton: true,
					}),
				},
				RubricCategoryFk: {
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedRubricCategoryLookupService,
						showGrid: false,
						clientSideFilter: {
							execute(item: IBasicsCustomizeRubricCategoryEntity): boolean {
								return item.RubricFk === Rubric.ConstructionSystems;
							},
						},
					}),
				},
				StructureFk: {
					...BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
					readonly: true,
				},
				CosGroupFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ConstructionSystemSharedGroupComboboxLookupService,
						showDescription: true,
						descriptionMember: 'DescriptionInfo.Description',
					}),
					readonly: true,
				},
				IsChecked: { readonly: false },
				CosTemplateFk: { readonly: false },
				Reference: { readonly: true },
				MatchCode: { readonly: true },
				CommentText: { readonly: true },
				IsDistinctInstances: { readonly: true },
				DescriptionInfo: { readonly: true },
			},
			transientFields: [
				{
					id: 'ChangeOption.IsCopyLineItems',
					model: 'ChangeOption.IsCopyLineItems',
					type: FieldType.Boolean,
					label: { key: 'constructionsystem.master.entityIsCopyLineItems' },
					readonly: true,
				},
				{
					id: 'ChangeOption.IsMergeLineItems',
					model: 'ChangeOption.IsMergeLineItems',
					type: FieldType.Boolean,
					label: { key: 'constructionsystem.master.entityIsMergeLineItems' },
					readonly: true,
				},
				{
					id: 'ChangeOption.IsChange',
					model: 'ChangeOption.IsChange',
					type: FieldType.Boolean,
					label: { key: 'constructionsystem.master.entityIsChange' },
					readonly: true,
				},
			],
		};
	}
}
