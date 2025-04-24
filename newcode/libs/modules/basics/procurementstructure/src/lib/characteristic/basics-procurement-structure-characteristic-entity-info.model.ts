/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { BasicsProcurementStructureDataService } from '../procurement-structure/basics-procurement-structure-data.service';

/**
 * Entity info for procurement structure characteristic
 */
export const PROCUREMENT_STRUCTURE_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: 'fc9fcbb187da46c780e047ca4ea35997',
	sectionId: BasicsCharacteristicSection.ProcurementStructure,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(BasicsProcurementStructureDataService);
	},	
},);