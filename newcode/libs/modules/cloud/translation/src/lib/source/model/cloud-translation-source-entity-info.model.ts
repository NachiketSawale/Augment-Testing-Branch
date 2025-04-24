/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { CloudTranslationSourceDataService } from '../services/cloud-translation-source-data.service';
import { ISourceEntity } from './entities/source-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
/**
 * Cloud Translation Source Entity Info
 */
export const CLOUD_TRANSLATION_SOURCE_ENTITY_INFO: EntityInfo = EntityInfo.create<ISourceEntity>({
	grid: {
		title: { key: 'cloud.translation.sourceListTitle' },
	},
	form: {
		title: { key: 'cloud.translation.sourceDetailTitle' },
		containerUuid: '4444643b757b4b1db98d603599E0a7a0',
	},
	dataService: (ctx) => ctx.injector.get(CloudTranslationSourceDataService),
	dtoSchemeId: { moduleSubModule: 'Cloud.Translation', typeName: 'SourceDto' },
	permissionUuid: '55c5907fd4224605876685a2b6066783',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				title: {
					text: 'Basic Data',
					key: 'cloud.common.entityProperties',
				},
				attributes: ['Id', 'Description', 'IsDefault', 'ModuleName', 'Sorting', 'SourceTypeFk'],
			},
		],
		labels: {
			...prefixAllTranslationKeys('cloud.translation.', {
				Id: {
					text: 'Id',
				},
				Description: {
					text: 'Description',
				},
				Sorting: {
					text: 'Sorting',
				},
				IsDefault: {
					text: 'Is Default',
				},
				SourceTypeFk: {
					key: 'sourcetype',
					text: 'Source Type',
				},
				ModuleName: {
					key: 'modulename',
					text: 'Module Name',
				},
			}),
		},
		overloads: {
			Id: { readonly: true },
			SourceTypeFk:BasicsSharedCustomizeLookupOverloadProvider.provideTranslationSourceTypeLookupOverload(true)
		},
	},
});

