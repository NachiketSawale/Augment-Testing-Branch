/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { ProcurementRequisitionHeaderDataService } from '../../services/requisition-header-data.service';

/**
 * Entity info for procurement Requisition characteristic
 */
export const PROCUREMENT_REQUISITION_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: 'b3f1b7a59f40437f878f680a1bd4f8e7',
	sectionId: BasicsCharacteristicSection.Requisition,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementRequisitionHeaderDataService);
	},	
},);