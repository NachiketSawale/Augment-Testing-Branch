/*
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ENTITY_DEFAULT_GROUP_ID, EntityInfo } from '@libs/ui/business-base';
import { IDataTreeEntity } from './entities/entities';
import { ModelAdministrationDataTreeDataService } from '../services/data-tree-data.service';

export const DATA_TREE_ENTITY = EntityInfo.create<IDataTreeEntity>({
	dtoSchemeId: {
		moduleSubModule: 'Model.Administration',
		typeName: 'DataTreeDto'
	},
	grid: {
		title: {key: 'model.administration.dataTree.dataTreeListTitle'}
	},
	form: {
		title: {key: 'model.administration.dataTree.dataTreeDetailTitle'},
		containerUuid: 'f04423524cb94bd1a76330c348f8e1b8'
	},
	permissionUuid: '373d22dca21440bda308ff6e85f81a85',
	dataService: ctx => ctx.injector.get(ModelAdministrationDataTreeDataService),
	layoutConfiguration: {
		groups: [{
			gid: ENTITY_DEFAULT_GROUP_ID,
			attributes: ['DescriptionInfo', 'RootDescription', 'RootCode', 'UnsetText']
		}],
		labels: prefixAllTranslationKeys('model.administration.', {
			RootDescription: 'rootDescription',
			RootCode: 'rootCode',
			UnsetText: 'unsetText'
		})
	}
});
