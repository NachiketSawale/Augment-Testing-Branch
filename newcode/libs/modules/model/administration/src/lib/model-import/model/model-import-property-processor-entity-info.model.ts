/*
 * Copyright(c) RIB Software GmbH
 */

import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ILayoutConfiguration } from '@libs/ui/common';
import {
	ENTITY_DEFAULT_GROUP_ID,
	EntityInfo
} from '@libs/ui/business-base';
import { PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';
import { IModelImportPropertyProcessorEntity } from './entities/entities';
import { ModelAdministrationModelImportPropertyProcessorDataService } from '../services/model-import-property-processor-data.service';

export const MODEL_IMPORT_PROPERTY_PROCESSOR_ENTITY_INFO = EntityInfo.create<IModelImportPropertyProcessorEntity>({
	dtoSchemeId: {
		moduleSubModule: 'Model.Administration',
		typeName: 'ModelImportPropertyProcessorDto'
	},
	grid: {
		title: {key: 'model.administration.importPropertyProcessorListTitle'}
	},
	form: {
		title: {key: 'model.administration.importPropertyProcessorDetailTitle'},
		containerUuid: '44f7428f27c94325ba46d1c2357f5ee7'
	},
	permissionUuid: '2744eda347844751ad0a61950b4ad6cf',
	dataService: ctx => ctx.injector.get(ModelAdministrationModelImportPropertyProcessorDataService),
	layoutConfiguration: async ctx => {
		const pkLookupProvider = await ctx.lazyInjector.inject(PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN);

		return <ILayoutConfiguration<IModelImportPropertyProcessorEntity>>{
			groups: [{
				gid: ENTITY_DEFAULT_GROUP_ID,
				attributes: ['PropertyKeyFk', 'ProcessorKey', 'Sorting', 'UseInheritance', 'CleanUp', 'Overwrite']
			}],
			overloads: {
				PropertyKeyFk: pkLookupProvider.generatePropertyKeyLookup({
					showClearButton: true
				})
				// TODO: lookup for property processor DEV-18672
			},
			labels: prefixAllTranslationKeys('model.administration.', {
				PropertyKeyFk: 'propertyKey',
				ProcessorKey: 'processorKey',
				UseInheritance: 'useInheritance',
				CleanUp: 'cleanUp',
				Overwrite: 'overwrite'
			})
		};
	}
});
