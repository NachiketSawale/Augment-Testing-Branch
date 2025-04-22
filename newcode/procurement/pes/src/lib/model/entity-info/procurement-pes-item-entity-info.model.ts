/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IPesItemEntity } from '../entities';
import { PrcStockTransactionTypeLookupService } from '@libs/procurement/shared';
import { ProcurementPesItemDataService } from '../../services/procurement-pes-item-data.service';
import { ProcurementPesItemLayoutService } from '../../services/layouts/procurement-pes-item-layout.service';
import { ProcurementPesItemValidationService } from '../../services/validations/procurement-pes-item-validation.service';
import { PROCUREMENT_PES_ENTITY_SCHEMA_ID } from '../procurement-pes-entity-schema-id.model';
import { ProcurementPesItemBehavior } from '../../behaviors/procurement-pes-item-behavior.service';

export const PROCUREMENT_PES_ITEM_ENTITY_INFO = EntityInfo.create<IPesItemEntity>({
	grid: {
		title: { key: 'procurement.pes.itemContainerTitle' },
		behavior: (context) => context.injector.get(ProcurementPesItemBehavior),
	},
	form: {
		containerUuid: '63ffc067c37f41a495e923d758e3044d',
		title: { key: 'procurement.pes.itemDetailContainerTitle' },
	},
	permissionUuid: 'ea88ecbb5aca40dea0df3ef2182bbeb0',
	dtoSchemeId: PROCUREMENT_PES_ENTITY_SCHEMA_ID.pesItem,
	dataService: (context) => context.injector.get(ProcurementPesItemDataService),
	validationService: (context) => context.injector.get(ProcurementPesItemValidationService),
	layoutConfiguration: (context) => context.injector.get(ProcurementPesItemLayoutService).generateLayout(context),
	prepareEntityContainer: async (context) => {
		await Promise.all([context.injector.get(PrcStockTransactionTypeLookupService).getList()]);
	},
});
