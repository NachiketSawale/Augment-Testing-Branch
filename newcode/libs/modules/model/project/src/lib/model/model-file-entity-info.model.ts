/*
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { ENTITY_DEFAULT_GROUP_ID, EntityInfo } from '@libs/ui/business-base';
import { PROPERTY_KEY_TAG_HELPER_TOKEN } from '@libs/model/interfaces';
import { IModelFileEntity } from './entities/model-file-entity.interface';
import { ModelProjectModelFileDataService } from '../services/model-file-data.service';

export const MODEL_FILE_ENTITY_INFO = EntityInfo.create<IModelFileEntity>({
	dtoSchemeId: {
		moduleSubModule: 'Model.Project',
		typeName: 'ModelFileDto'
	},
	permissionUuid: '8b4e238704f84550b00830dec07b25b5',
	grid: {
		title: { key: 'model.project.modelFileListContainer' }
	},
	form: {
		containerUuid: '4909263a40954a3caf4f757e782dd679',
		title: { key: 'model.project.modelFileDetailContainer' }
	},
	dataService: ctx => ctx.injector.get(ModelProjectModelFileDataService),
	layoutConfiguration: async ctx => {
		const propKeyTagHelperSvc = await ctx.lazyInjector.inject(PROPERTY_KEY_TAG_HELPER_TOKEN);

		return <ILayoutConfiguration<IModelFileEntity>>{
			groups: [
				{
					gid: ENTITY_DEFAULT_GROUP_ID,
					attributes: ['Description', 'OriginFileName']
				},
				{
					gid: 'modelCnvGroup',
					// TODO: action?
					attributes: ['status', 'PkTagIds', 'Trace', 'ImportProfileFk']
				}
			],
			overloads: {
				// TODO: OriginFileName
				status: {
					type: FieldType.Action
				},
				PkTagIds: propKeyTagHelperSvc.generateTagsFieldOverload(),
				Trace: {
					readOnly: true
				}
				// TODO:ImportProfileFk lookup DEV-17437 and follow-ups
			},
			transientFields: [{
				id: 'actions',
				type: FieldType.Action,
				actions: [{
					id: 'launch',
					iconClass: 'tlb-icons ico-settings',
					caption: {key: 'model.project.convertModel'},
					disabled: info => !(info.context.State <= 0 || info.context.State >= 3)
					// TODO: fn like in model-project-file-conversion-service.js
				}]
			}],
			labels: {
				...prefixAllTranslationKeys('model.project.', {
					modelCnvGroup: 'modelCnvGroup',
					OriginFileName: 'entityFileArchiveDoc',
					PkTagIds: 'pkTags',
					Trace: 'trace',
					ImportProfileFk: 'modelImportPrf',
					status: 'status',
					actions: 'action'
				}),
				State: {key: 'cloud.common.entityStatus'}
			}
		};
	}
});