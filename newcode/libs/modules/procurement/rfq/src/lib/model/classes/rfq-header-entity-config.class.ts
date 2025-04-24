/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityInfo } from '@libs/ui/business-base';
import { IRfqHeaderEntity } from '@libs/procurement/interfaces';
import { ProcurementRfqLayoutService } from '../../services/layouts/procurement-rfq-layout.service';

/**
 * Represents the entity configuration for RFQ header.
 */
export const RFQ_HEADER_ENTITY_CONFIG: Partial<IEntityInfo<IRfqHeaderEntity>> = {
	grid: {
		title: {
			text: 'Request For Quotes',
			key: 'procurement.rfq.headerGridTitle'
		},
		behavior: {},
	},
	form: {
		title: {
			text: 'Request For Quote Detail',
			key: 'procurement.rfq.headerFormTitle'
		},
		containerUuid: ''
	},
	dtoSchemeId: {
		moduleSubModule: 'Procurement.RfQ',
		typeName: 'RfqHeaderDto'
	},
	layoutConfiguration: context => {
		return context.injector.get(ProcurementRfqLayoutService).generateLayout();
	},
	prepareEntityContainer: async ctx => {

	}
};