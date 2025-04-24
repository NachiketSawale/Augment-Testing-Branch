/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { CloudTranslationTranslationDataService } from '../services/cloud-translation-translation-data.service';
import { ITranslationEntity } from './entities/translation-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { FieldType, createLookup } from '@libs/ui/common';
import { CloudTranslationLanguageLookupService } from '../services/cloud-translation-language-lookup.service';

/**
 * Cloud Translation Entity Info Configuration
 */
export const CLOUD_TRANSLATION_TRANSLATION_ENTITY_INFO: EntityInfo = EntityInfo.create<ITranslationEntity>({
	grid: {
		title: { key: 'cloud.translation.translationListTitle' },
	},
	form: {
		title: { key: 'cloud.translation.translationDetailTitle' },
		containerUuid: '26fb24afe1d64f8aa6434b9ee43919e5',
	},
	dataService: (ctx) => ctx.injector.get(CloudTranslationTranslationDataService),
	dtoSchemeId: { moduleSubModule: 'Cloud.Translation', typeName: 'TranslationDto' },
	permissionUuid: '13ff9d4cc7e149ca8965c702870639c2',
	layoutConfiguration:  {
		groups: [
			{
				gid: 'basicData',
				title: {
					text: 'Basic Data',
					key: 'cloud.common.entityProperties',
				},
				attributes: ['Id', 'ResourceFk', 'LanguageFk', 'Translation', 'IsApproved', 'IsTranslated', 'ApprovedBy', 'Remark', 'Ischanged'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('cloud.translation.', {
				Id: {
					text: 'Id',
				},
				ResourceFk: {
					key: 'resourceEntity',
					text: 'Resource',
				},
				LanguageFk: {
					key: 'languageEntity',
					text: 'Language',
				},
				Translation: {
					key: 'translationEntity',
					text: 'Translation',
				},
				IsApproved: {
					key: 'isapproved',
					text: 'Is Approved',
				},
				IsTranslated: {
					key: 'isTranslated',
					text: 'Is Translated',
				},
				ApprovedBy: {
					key: 'approvedby',
					text: 'Approved By',
				},
				Remark: {
					text: 'Remarks',
				},
				Ischanged: {
					text: 'Is Changed',
				},
			}),
		},
		overloads: {
			Id: { readonly: true },
			ResourceFk: { readonly: true },
			LanguageFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: CloudTranslationLanguageLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'Description',
				}),
			},
		},
	},
});
