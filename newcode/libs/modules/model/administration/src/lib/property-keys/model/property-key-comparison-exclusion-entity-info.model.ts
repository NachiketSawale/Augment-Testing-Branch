/*
 * Copyright(c) RIB Software GmbH
 */

import { ILayoutConfiguration } from '@libs/ui/common';
import { ENTITY_DEFAULT_GROUP_ID, EntityInfo } from '@libs/ui/business-base';
import { PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';
import { IPropertyKeyComparisonExclusionEntity } from './entities/entities';
import { ModelAdministrationPropertyKeyComparisonExclusionDataService } from '../services/property-key-comparison-exclusion-data.service';
import { ModelAdministrationPropertyKeyComparisonExclusionBehaviorService } from '../behaviors/property-key-comparison-exclusion-behavior.service';
import { ModelAdministrationPropertyKeyComparisonExclusionValidationService } from '../services/property-key-comparison-exclusion-validation.service';

export const PROPERTY_KEY_COMPARISON_EXCLUSION_ENTITY_INFO = EntityInfo.create<IPropertyKeyComparisonExclusionEntity>({
	dtoSchemeId: {
		moduleSubModule: 'Model.Administration',
		typeName: 'ModelComparePropertykeyBlackListDto'
	},
	permissionUuid: 'e669db59cf314255a84f02c276ce224c',
	grid: {
		title: { key: 'model.administration.blackListListTitle' },
		containerUuid: '51db6299be4f4d3097919ef4492b0cdc'
	},
	form: {
		containerUuid: '3af9713a684b449aafe617272ba68ac9',
		title: { key: 'model.administration.blackListDetailTitle' }
	},
	dataService: ctx => ctx.injector.get(ModelAdministrationPropertyKeyComparisonExclusionDataService),
	validationService: ctx => ctx.injector.get(ModelAdministrationPropertyKeyComparisonExclusionValidationService),
	containerBehavior: ctx => ctx.injector.get(ModelAdministrationPropertyKeyComparisonExclusionBehaviorService),
	layoutConfiguration: async ctx => {
		const pkLookupProvider = await ctx.lazyInjector.inject(PROPERTY_KEY_LOOKUP_PROVIDER_TOKEN);

		return <ILayoutConfiguration<IPropertyKeyComparisonExclusionEntity>>{
			groups: [{
				gid: ENTITY_DEFAULT_GROUP_ID,
				attributes: ['PropertyKeyFk']
			}],
			overloads: {
				PropertyKeyFk: pkLookupProvider.generatePropertyKeyLookup()
			}
		};
	}
});
