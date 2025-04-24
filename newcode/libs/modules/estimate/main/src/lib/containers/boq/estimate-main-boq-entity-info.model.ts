/*
 * Copyright(c) RIB Software GmbH
 */

import { IBoqItemEntity } from '@libs/boq/interfaces';
import { EntityInfo } from '@libs/ui/business-base';
import { EstimateMainBoqLayoutService } from './estimate-main-boq-layout.service';
import { EstimateMainBoqDataService } from './estimate-main-boq-data.service';

export const ESTIMATE_MAIN_BOQ_ENTITY_INFO: EntityInfo = EntityInfo.create<IBoqItemEntity>({
	grid: {
		title: { key: 'boq.main' + '.boqList' },
		containerUuid: 'ecaf41be6cc045588297d5efb9745fe4'
	},
	dataService: ctx => ctx.injector.get(EstimateMainBoqDataService),
	dtoSchemeId: { moduleSubModule: 'Boq.Main', typeName: 'BoqItemDto' },
	permissionUuid: 'ecaf41be6cc045588297d5efb9745fe4',

	layoutConfiguration: context => {
		return context.injector.get(EstimateMainBoqLayoutService).generateConfig();
	}
});