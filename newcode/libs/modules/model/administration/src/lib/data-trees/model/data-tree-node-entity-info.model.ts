/*
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import { ENTITY_DEFAULT_GROUP_ID, EntityInfo } from '@libs/ui/business-base';
import { IDataTreeNodeEntity } from './entities/entities';
import { ModelAdministrationDataTreeNodeDataService } from '../services/data-tree-node-data.service';
import { ModelAdministrationDataTreeLookupProviderService } from '../services/data-tree-lookup-provider.service';

export const DATA_TREE_NODE_ENTITY = EntityInfo.create<IDataTreeNodeEntity>({
	dtoSchemeId: {
		moduleSubModule: 'Model.Administration',
		typeName: 'DataTreeNodeDto'
	},
	grid: {
		title: {key: 'model.administration.dataTree.dataTreeNodeListTitle'},
		treeConfiguration: true
	},
	form: {
		title: {key: 'model.administration.dataTree.dataTreeNodeDetailTitle'},
		containerUuid: '19a6a6b9816e49d99141986d8880fb39'
	},
	permissionUuid: 'beb34f7d5c704610870cba1be748cc34',
	dataService: ctx => ctx.injector.get(ModelAdministrationDataTreeNodeDataService),
	layoutConfiguration: async ctx => {
		const dtLookupProvider = ctx.injector.get(ModelAdministrationDataTreeLookupProviderService);

		return <ILayoutConfiguration<IDataTreeNodeEntity>>{
			groups: [{
				gid: ENTITY_DEFAULT_GROUP_ID,
				attributes: ['DataTreeLevelFk', 'value', 'Sorting', 'IsUnset']
			}],
			overloads: {
				DataTreeLevelFk: {
					...dtLookupProvider.generateDataTreeLevelLookup(),
					readonly: true
				}
			},
			transientFields: [
				// TODO: add dynamic field for Value once implemented (DEV-15866)
			],
			labels: prefixAllTranslationKeys('model.administration.', {
				DataTreeLevelFk: 'dataTreeLevel',
				IsUnset: 'isUnset'
			})
		};
	}
});
