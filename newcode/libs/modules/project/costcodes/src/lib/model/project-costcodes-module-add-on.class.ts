/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectable } from '@libs/platform/common';
import { IBusinessModuleAddOn } from '@libs/ui/business-base';
import { PROJECT_COSTCODES_MODULE_ADD_ON_TOKEN } from '@libs/project/interfaces';
import { PROJECT_COST_CODES_ENTITY_INFO } from './entities/project-costcode-entity-info.model';
import { PROJECT_COST_CODES_JOB_RATE_ENTITY_INFO } from './entities/project-cost-codes-jobrate-entity-info';

@LazyInjectable({
	token: PROJECT_COSTCODES_MODULE_ADD_ON_TOKEN
})
export class ProjectCostcodesModuleAddOn implements IBusinessModuleAddOn {

	public readonly entities = [
		PROJECT_COST_CODES_ENTITY_INFO,
		PROJECT_COST_CODES_JOB_RATE_ENTITY_INFO
	];
	
}
