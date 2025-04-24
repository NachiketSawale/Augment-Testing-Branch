/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { SalesWipWipsDataService } from '../services/sales-wip-wips-data.service';

/**
 * Entity info for sales wip characteristic
 */
export const SALES_WIP_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: '79db0ff7fcda4e0c944fcde734878044',
	sectionId: BasicsCharacteristicSection.SalesWip,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(SalesWipWipsDataService);
	},
});

/**
 * Entity info for sales wip characteristic2
 */
export const SALES_WIP_CHARACTERISTIC2_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: '032228067a6b4413b6de2d938a16f315',
	gridTitle:'basics.common.characteristic2.title',
	sectionId: BasicsCharacteristicSection.SalesWip2,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(SalesWipWipsDataService);
	},
});