/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsControllingCostCodesDataService } from '../services/basics-controlling-cost-codes-data.service';
import { IContrCostCodeEntity } from './entities/contr-cost-code-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';


export const BASICS_CONTROLLING_COST_CODES_ENTITY_INFO: EntityInfo = EntityInfo.create<IContrCostCodeEntity>({
	grid: {
		title: {key: 'basics.controllingcostcodes.controllingCostCode'},
	},
	form: {
		title: {key: 'basics.controllingcostcodes.controllingCostCodesDetails'},
		containerUuid: 'f45707e67df846dfaf61f8a0c76053d3',
	},
	// containerBehavior: // TODO: for grid+form
	dataService: ctx => ctx.injector.get(BasicsControllingCostCodesDataService),
	dtoSchemeId: {moduleSubModule: 'Basics.ControllingCostCodes', typeName: 'ContrCostCodeDto'},
	permissionUuid: 'ec5c193f31594e03b340da66dc42cc17',
	layoutConfiguration: {
		groups: [
			{
				gid: 'basicData',
				attributes: ['Code', 'DescriptionInfo', 'UomFk', 'CommentText', 'IsRevenue', 'IsCostPrr', 'IsRevenuePrr']
			}
		],
		overloads: {
			UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('cloud.common.', {
				Code: {key: 'entityCode'},
				DescriptionInfo: {key: 'entityDescription'},
				UomFk: {key: 'entityUoM'},
				CommentText: {key: 'entityComment'},
				IsRevenue: {key: 'entityIsRevenue'},
				IsCostPrr: {key: 'entityIsCostPrr'},
				IsRevenuePrr: {key: 'entityIsRevenuePrr'},
			})
		}
	}

});