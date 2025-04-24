
/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ControllingControllingunittemplateGroupBehavior } from '../behaviors/controlling-controllingunittemplate-group-behavior.service';
import { ControllingControllingunittemplateGroupDataService } from '../services/controlling-controllingunittemplate-group-data.service';
import { IControltemplateGroupEntity } from './models';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';


export const CONTROLLING_CONTROLLINGUNITTEMPLATE_GROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<IControltemplateGroupEntity>({
	grid: {
		title: { key: 'controlling.controllingunittemplate.controllinggroupListTitle' },
		behavior: ctx => ctx.injector.get(ControllingControllingunittemplateGroupBehavior),
		containerUuid: 'a3aaf163058647c0872d13d0d2cd1c3d',
	},
	form: {
		title: { key: 'controlling.controllingunittemplate.controllinggroupDetailTitle' },
		containerUuid: 'e062e5cb80894fd8abf2949ab1c164bb',
	},
	dataService: ctx => ctx.injector.get(ControllingControllingunittemplateGroupDataService),
	dtoSchemeId: { moduleSubModule: 'Controlling.ControllingUnitTemplate', typeName: 'ControltemplateGroupDto' },
	permissionUuid: '201b468b575042a090e366d830c5a60d',
	layoutConfiguration: {
		groups: [
			{ gid: 'Basic Data', attributes: ['ControllingGroupFk','ControllingGroupEntity', 'ControllingGrpDetailFk'] },
		],
		overloads: {
			ControllingGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupLookupOverload(true),
			ControllingGrpDetailFk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupDetailLookupOverload(true),

		},
		labels: {
			...prefixAllTranslationKeys('controlling.structure.', {
				ControllingGroupFk: { key: 'entityControllinggroupFk' },
				ControllingGrpDetailFk: { key: 'entityControllinggroupdetailFk' },
			}),
		},
	}

});