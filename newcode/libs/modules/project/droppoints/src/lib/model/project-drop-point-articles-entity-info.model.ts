/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { projectDropPointArticlesEntityInfoGenerated } from './generated/project-drop-point-articles-entity-info-generated.model';
import { IProjectDropPointArticlesEntity } from '@libs/project/interfaces';
import { EntityInfo, IEntityInfo } from '@libs/ui/business-base';
import { RESOURCE_EQUIPMENT_LOOKUP_PROVIDER_TOKEN } from '@libs/resource/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';

const projectDropPointArticlesEntityInfo = <Partial<IEntityInfo<IProjectDropPointArticlesEntity>>>{
	layoutConfiguration : async (ctx) => {
		const resourceEquipmentLookupProvider = await ctx.lazyInjector.inject(RESOURCE_EQUIPMENT_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IProjectDropPointArticlesEntity>>{
			overloads: {
				PlantFk: resourceEquipmentLookupProvider.providePlantLookupOverload()
			},
		};
	}
};
export const PROJECT_DROP_POINT_ARTICLES_ENTITY_INFO = EntityInfo.create(EntityInfo.MergeEntityInfo(projectDropPointArticlesEntityInfoGenerated,projectDropPointArticlesEntityInfo));