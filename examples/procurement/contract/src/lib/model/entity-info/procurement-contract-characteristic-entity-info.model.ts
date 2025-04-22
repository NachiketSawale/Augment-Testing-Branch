/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { ProcurementContractHeaderDataService } from '../../services/procurement-contract-header-data.service';

/**
 * Entity info for procurement contract characteristic
 */
export const PROCUREMENT_CONTRACT_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: 'd2b5525ef2ee49e4b820de6004dfb8c4',
	sectionId: BasicsCharacteristicSection.Contract,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementContractHeaderDataService);
	},
});