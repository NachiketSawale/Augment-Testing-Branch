/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { resourceTypeAlternativeResTypeEntityInfoGenerated } from './generated/resource-type-alternative-res-type-entity-info-generated.model';
import { EQUIPMENT_GROUP_LOOKUP_PROVIDER_TOKEN, IResourceTypeAlternativeResTypeEntity } from '@libs/resource/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';

const resourceTypeAlternativeResTypeEntityInfo = <Partial<IEntityInfo<IResourceTypeAlternativeResTypeEntity>>>{

	layoutConfiguration: async (ctx) => {
		const plantGroupLookupProvider = await ctx.lazyInjector.inject(EQUIPMENT_GROUP_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IResourceTypeAlternativeResTypeEntity>>{
			groups: [
				{
					gid: 'default',
					attributes: [
						'PlantGroupFk',
					]
				},
			],
			overloads: {
				PlantGroupFk: plantGroupLookupProvider.generateEquipmentGroupReadOnlyLookup()
			},
			labels: {
				...prefixAllTranslationKeys('resource.equipmentgroup.', {
					PlantGroupFk: {key: 'entityPlantGroup'}
				})
			}
		};
	}
};
export const RESOURCE_TYPE_ALTERNATIVE_RES_TYPE_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(resourceTypeAlternativeResTypeEntityInfoGenerated,resourceTypeAlternativeResTypeEntityInfo));