/*
 * Copyright(c) RIB Software GmbH
 */

import { BasicsSharedCharacteristicDataEntityInfoFactory } from '@libs/basics/shared';
import { BasicsCharacteristicSection } from '@libs/basics/interfaces';
import { ProcurementQuoteHeaderDataService } from '../../services/quote-header-data.service';

/**
 * Entity info for procurement Quote characteristic
 */
export const PROCUREMENT_QUOTE_CHARACTERISTIC_ENTITY_INFO = BasicsSharedCharacteristicDataEntityInfoFactory.create({
	permissionUuid: '7214523301dc419081942479f0f30cfc',
	sectionId: BasicsCharacteristicSection.Quote,
	parentServiceFn: (ctx) => {
		return ctx.injector.get(ProcurementQuoteHeaderDataService);
	},	
},);