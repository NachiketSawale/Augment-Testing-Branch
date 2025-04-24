/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { EstimateAssembliesCtrlGroupDataService } from '../services/estimate-assemblies-ctrl-group-data.service';
import { IEstLineitem2CtrlGrpEntity } from './entities/est-lineitem-2ctrl-grp-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';

/**
 * Entity information configuration object.
 */
export const ESTIMATE_ASSEMBLIES_CTRL_GROUP_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstLineitem2CtrlGrpEntity>({
	grid: {
		title: { key: 'estimate.assemblies.containers.controllingGroupAssignments' },
	},

	dataService: (ctx) => ctx.injector.get(EstimateAssembliesCtrlGroupDataService),
	dtoSchemeId: { moduleSubModule: 'Estimate.Assemblies', typeName: 'EstLineitem2CtrlGrpDto' },
	permissionUuid: '588BE3EE73E94971A1C7A0BC7867C6BD',

    layoutConfiguration: {
		groups: [{
			gid: 'basicData',
			attributes: ['ControllinggroupFk', 'ControllinggroupDetailFk']
		}],
		labels: {
			...prefixAllTranslationKeys('estimate.assemblies.', {
				ControllinggroupFk: { key: 'entityControllingGroupFk' },
                ControllinggroupDetailFk: { key: 'entityControllingGroupDetailFk' },
			})
        
		},

        overloads :{
           ControllinggroupFk :BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupReadonlyLookupOverload(),
           ControllinggroupDetailFk:BasicsSharedCustomizeLookupOverloadProvider.provideMdcControllingGroupDetailLookupOverload(true)
        }
	}
});
