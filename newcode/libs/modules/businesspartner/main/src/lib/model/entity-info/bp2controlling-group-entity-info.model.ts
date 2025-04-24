import { EntityInfo } from '@libs/ui/business-base';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { Bp2controllingGroupDataService } from '../../services/bp2controlling-group-data.service';
import {
	BasicsSharedCustomizeLookupOverloadProvider,
} from '@libs/basics/shared';
import { IBp2controllinggroupEntity } from '@libs/businesspartner/interfaces';

export const BP2CONTROLLING_GROUP_ENTITY_INFO = EntityInfo.create<IBp2controllinggroupEntity>({
	grid: {
		title: {
			text: 'Controlling Group Assignments',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.controllingGroupAssignments.grid',
		},
		containerUuid: 'e1d50a8873f44a86907a12f394be47e8'
	},
	form: {
		title: {
			text: 'Controlling Group Assignments Details',
			key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.controllingGroupAssignments.Detail',
		},
		containerUuid: 'b6fed3ec7d914084905d88ef1e1da4c3',
	},
	// eslint-disable-next-line strict
	dataService: (ctx) => ctx.injector.get(Bp2controllingGroupDataService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainPascalCasedModuleName, typeName: 'Bp2controllinggroupDto' },
	permissionUuid: 'e1d50a8873f44a86907a12f394be47e8',
	layoutConfiguration: {
		groups: [
			{ gid: 'basicData', attributes: ['ControllinggroupFk', 'ControllinggrpdetailFk']}
		],
		overloads: {
			ControllinggroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupLookupOverload(false),
			ControllinggrpdetailFk: BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupDetailLookupOverload(false),
		},
		labels: {
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
				ControllinggroupFk: { key: 'ControllinggroupFk'},
				ControllinggrpdetailFk: { key: 'ControllinggrpdetailFk'}
			})
		}
	}
});