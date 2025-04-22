/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { ProcurementPesHeaderDataService } from '../../services/procurement-pes-header-data.service';
/**
 * Entity info for procurement pes characteristic 2
 */
export const PROCUREMENT_PES_CHARACTERISTIC2_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create2({
	permissionUuid: 'dd246be8427448679cd2d0ba08d691cc',
    gridTitle:'basics.common.characteristic2.title',
	sectionId: BasicsCharacteristicSection.PesCharacteristics2,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementPesHeaderDataService);
	}
});