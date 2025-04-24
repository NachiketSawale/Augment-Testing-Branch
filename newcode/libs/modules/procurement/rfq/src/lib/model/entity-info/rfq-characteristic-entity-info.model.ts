/*
 * Copyright(c) RIB Software GmbH
 */
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { ProcurementRfqHeaderMainDataService } from '../../services/procurement-rfq-header-main-data.service';
/**
 * Entity info for RFQ characteristic
 */
export const RFQ_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: 'DE7F382A4AD949F5BE04354B1D4323A4',
	sectionId: BasicsCharacteristicSection.RfQ,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementRfqHeaderMainDataService);
	},
});