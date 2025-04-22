/*
 * Copyright(c) RIB Software GmbH
 */

import {
	PlatformPermissionService,
	prefixAllTranslationKeys
} from '@libs/platform/common';
import {
	ENTITY_DEFAULT_GROUP_ID,
	EntityInfo
} from '@libs/ui/business-base';
import { IModelImportProfileEntity } from './entities/entities';
import {
	GLOBAL_IMPORT_PROFILE_PERMISSION,
	ModelAdministrationModelImportProfileDataService
} from '../services/model-import-profile-data.service';

export const MODEL_IMPORT_PROFILE_ENTITY_INFO = EntityInfo.create<IModelImportProfileEntity>({
	dtoSchemeId: {
		moduleSubModule: 'Model.Administration',
		typeName: 'ModelImportProfileDto'
	},
	grid: {
		title: {key: 'model.administration.modelImport.importProfileListTitle'}
	},
	form: {
		title: {key: 'model.administration.modelImport.importProfileDetailTitle'},
		containerUuid: '225eae28ec104a3fa0c8b6210948fbf2'
	},
	permissionUuid: 'aa55f4fd2cbd43f69bead3e4a5cd454f',
	dataService: ctx => ctx.injector.get(ModelAdministrationModelImportProfileDataService),
	prepareEntityContainer: async ctx => {
		const permissionSvc = ctx.injector.get(PlatformPermissionService);
		await permissionSvc.loadPermissions(GLOBAL_IMPORT_PROFILE_PERMISSION);
	},
	layoutConfiguration: {
		groups: [{
			gid: ENTITY_DEFAULT_GROUP_ID,
			attributes: ['Scope', 'DescriptionInfo', 'RemarkInfo']
		}, {
			gid: 'importConfigGroup',
			attributes: ['ShortenLongValues']
		}],
		overloads: {
			Scope: {
				readonly: true
			}
		},
		labels: prefixAllTranslationKeys('model.administration.', {
			Scope: 'scope',
			ShortenLongValues: 'shortenLongValues',
			importConfigGroup: 'importConfigGroup'
		})
	}
});
