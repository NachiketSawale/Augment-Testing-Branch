/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ConfigurationClerkRoleSlotDataService } from '../services/configuration-clerk-role-slot-data.service';
import { ConfigurationClerkRoleSlotBehavior } from '../behaviors/configuration-clerk-role-slot-behavior.service';
import { IClerkRoleSlotEntity } from './entities/clerk-role-slot-entity.interface';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';


export const CONFIGURATION_CLERK_ROLE_SLOT_ENTITY_INFO: EntityInfo = EntityInfo.create<IClerkRoleSlotEntity>({
	grid: {
		title: {key: 'productionplanning.configuration' + '.clerkroleslotListTitle'},
		behavior: ctx => ctx.injector.get(ConfigurationClerkRoleSlotBehavior),
		containerUuid: '52f5e3788e264d73acd0ea038972a68f'
	},
	dataService: ctx => ctx.injector.get(ConfigurationClerkRoleSlotDataService),
	dtoSchemeId: {moduleSubModule: 'ProductionPlanning.Configuration', typeName: 'ClerkRoleSlotDto'},
	permissionUuid: '40ad0cb374dd490f8abbceeccc89ac06',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['ClerkRoleFk', 'ColumnTitle', 'IsForEngTask', 'IsReadOnly', 'PpsEntityFk', 'PpsEntityRefFk',]
			}
		],
		overloads: {
			ClerkRoleFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(false),
			PpsEntityFk: BasicsSharedCustomizeLookupOverloadProvider.providePpsEntityLookupOverload(false),//TODO:filterKey: 'productionplanning-configuration-clerkrole-ppsentityfk-filter'
			PpsEntityRefFk: BasicsSharedCustomizeLookupOverloadProvider.providePpsEntityLookupOverload(true),//TODO:filterKey: 'productionplanning-configuration-clerkrole-ppsentityreffk-filter'
		},
		labels: {
			ClerkRoleFk: {key: 'basics.common.entityClerkRole', text: '*Clerk Role'},
			...prefixAllTranslationKeys('productionplanning.configuration.', {
				ColumnTitle: {key: 'columnTitle', text: '*Column Title'},
				IsForEngTask: {key: 'entityForEngTask', text: '*For Engineering Task'},
				IsReadOnly: {key: 'entityIsReadOnly', text: '*Read Only'},
				PpsEntityFk: {key: 'entityPpsEntityFk', text: 'Is Type For'},
				PpsEntityRefFk: {key: 'entityRefEntityFk', text: '*Ref. Type For'},
			}),
		}
	}
});