/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { EstimateProjectDataService } from '../services/estimate-project-data.service';
import { EntityInfo } from '@libs/ui/business-base';

export const ESTIMATE_PRJ_CHAR_DATA_ENTITY_INFO: EntityInfo = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: '183c55b9f3e7482298098e2346b2de84',
	containerUuid: '183c55b9f3e7482298098e2346b2de84',
	sectionId: BasicsCharacteristicSection.ProjectEstimateCharacteristic,
	gridTitle: 'project.main.estimateCharacteristics',
	parentServiceFn: (ctx) => {
		return ctx.injector.get(EstimateProjectDataService);
	},
});
