/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ControllingStructureUnitgroupDataService } from '../services/controlling-structure-unitgroup-data.service';
import { IControllingUnitGroupEntity } from './models';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';


export const CONTROLLING_STRUCTURE_UNITGROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<IControllingUnitGroupEntity>({
	grid: {
		title: {key: 'controlling.structure.containerTitleControllingGroupAssignments'}
	},
	form: {
		title: {key: 'controlling.structure.containerTitleControllingGroupAssignmentsForm'},
		containerUuid: '9832DABE9F3E4EE8BF3A0B3010E2122F',
	},
	dataService: ctx => ctx.injector.get(ControllingStructureUnitgroupDataService),
	dtoSchemeId: {moduleSubModule: 'Controlling.Structure', typeName: 'ControllingUnitGroupDto'},
	permissionUuid: '9E5B5809635C45DE90E27A567FF6B0E9',
	layoutConfiguration: {
		groups: [
			{
				gid: 'Basic Data',
				attributes: ['ControllinggroupFk', 'ControllinggroupdetailFk'],
			}
		],
		overloads: {
			ControllinggroupFk: BasicsSharedLookupOverloadProvider.provideMdcControllingGroupLookupOverload(true),
			ControllinggroupdetailFk: BasicsSharedLookupOverloadProvider.provideMdcControllingGroupDetailLookupOverload(true),

		},
		labels: {
			...prefixAllTranslationKeys('controlling.structure.', {
				ControllinggroupEntity: {key: 'entityControllinggroupEntity'},
				ControllinggroupFk: {key: 'entityControllinggroupFk'},
				ControllinggroupdetailFk: {key: 'entityControllinggroupdetailFk'},
				ControllinggroupdetailEntity: {key: 'entityControllinggroupdetailEntity'},
			}),
		}
	}

});