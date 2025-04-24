/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { SalesContractContractsDataService } from '../../services/sales-contract-contracts-data.service';

/**
 * Entity info for sales contract characteristic
 */
export const SALES_CONTRACT_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: 'd2b5525ef2ee49e4b820de6004dfb8c4',
	sectionId: BasicsCharacteristicSection.SalesContract,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(SalesContractContractsDataService);
	},
});

/**
 * Entity info for sales contract characteristic2
 */
export const SALES_CONTRACT_CHARACTERISTIC2_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: 'abdcb806f0fe4b78b3a3a0d8a947c3bf',
	gridTitle:'basics.common.characteristic2.title',
	sectionId: BasicsCharacteristicSection.SalesContract2,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(SalesContractContractsDataService);
	},
});