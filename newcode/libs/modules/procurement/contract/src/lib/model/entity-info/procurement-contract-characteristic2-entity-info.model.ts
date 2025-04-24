/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { ProcurementContractHeaderDataService } from '../../services/procurement-contract-header-data.service';

/**
 * Entity info for procurement contract characteristic 2
 */
export const PROCUREMENT_CONTRACT_CHARACTERISTIC2_ENTITY_INFO	= BasicsSharedCharacteristicDataEntityInfoFactory.create2({
	permissionUuid: 'abdcb806f0fe4b78b3a3a0d8a947c3bf',
    gridTitle:'basics.common.characteristic2.title',
	sectionId: BasicsCharacteristicSection.ContractCharacteristics2,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementContractHeaderDataService);
	}
});