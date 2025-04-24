/*
 * Copyright(c) RIB Software GmbH
 */

import { LazyInjectable } from '@libs/platform/common';
import { IBusinessModuleAddOn } from '@libs/ui/business-base';
import { ESTIMATE_PROJECT_MODULE_ADD_ON_TOKEN } from '@libs/estimate/interfaces';
import { ESTIMATE_PROJECT_ENTITY_INFO } from './estimate-project-entity-info.model';
import { ESTIMATE_PRJ_CHAR_DATA_ENTITY_INFO } from './estimate-project-characteristic-enitity-info.model';
import { ESTIMATE_PROJECT_CLERK_ENTITY_INFO } from './estimate-project-clerk-entity-info.model';
import { ESTIMATE_PROJECT_SPECIFICATION } from './estimate-project-specification.class';
import {ESTIMATE_PROJECT_RATE_BOOK_ENTITY_INFO} from './estimate-project-rate-book-entity-info.model';

@LazyInjectable({
	token: ESTIMATE_PROJECT_MODULE_ADD_ON_TOKEN
})
export class EstimateProjectModuleAddOn implements IBusinessModuleAddOn {

	public readonly entities = [
		ESTIMATE_PROJECT_ENTITY_INFO,
		ESTIMATE_PRJ_CHAR_DATA_ENTITY_INFO,
		ESTIMATE_PROJECT_CLERK_ENTITY_INFO,
		ESTIMATE_PROJECT_RATE_BOOK_ENTITY_INFO
	];

	public readonly containers = [
		ESTIMATE_PROJECT_SPECIFICATION
	];

}
