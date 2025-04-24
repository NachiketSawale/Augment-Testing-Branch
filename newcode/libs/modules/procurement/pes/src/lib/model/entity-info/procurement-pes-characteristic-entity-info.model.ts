/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { ProcurementPesHeaderDataService } from '../../services/procurement-pes-header-data.service';
/**
 * Entity info for procurement pes characteristic
 */
export const PROCUREMENT_PES_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: '8e8faa3023ec4dc9854ca399401fd5ce',
	sectionId: BasicsCharacteristicSection.ProcurementPes,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementPesHeaderDataService);
	},
});