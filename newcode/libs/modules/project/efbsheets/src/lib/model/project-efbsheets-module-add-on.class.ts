/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectable } from '@libs/platform/common';
import { IBusinessModuleAddOn } from '@libs/ui/business-base';
import { PROJECT_EFBSHEETS_MODULE_ADD_ON_TOKEN } from '@libs/project/interfaces';
import { PROJECT_EFBSHEETS_ENTITY_INFO } from './project-efbsheets-entity-info.model';
import { PROJECT_EFBSHEETS_CREW_MIX_COST_CODE_ENTITY_INFO } from './project-efbsheets-crew-mix-cost-code-entity-info.model';
import { PROJECT_EFBSHEETS_CREW_MIX_AF_ENTITY_INFO } from './project-efbsheets-crew-mix-af-entity-info.model';
import { PROJECT_EFBSHEETS_AVERAGE_WAGE_ENTITY_INFO } from './project-efbsheets-average-wage-entity-info.model';
import { PROJECT_EFBSHEETS_CREW_MIX_AFSN_ENTITY_INFO } from './project-efbsheets-crew-mix-afsn-entity-info.model';

@LazyInjectable({
	token: PROJECT_EFBSHEETS_MODULE_ADD_ON_TOKEN
})
export class ProjectEfbsheetsModuleAddOn implements IBusinessModuleAddOn {

	public readonly entities = [
		PROJECT_EFBSHEETS_ENTITY_INFO,
		PROJECT_EFBSHEETS_CREW_MIX_COST_CODE_ENTITY_INFO,
		PROJECT_EFBSHEETS_CREW_MIX_AF_ENTITY_INFO,
		PROJECT_EFBSHEETS_AVERAGE_WAGE_ENTITY_INFO,
		PROJECT_EFBSHEETS_CREW_MIX_AFSN_ENTITY_INFO
	];

}
