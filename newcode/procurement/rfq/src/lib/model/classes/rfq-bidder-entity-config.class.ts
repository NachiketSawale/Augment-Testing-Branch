/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityInfo } from '@libs/ui/business-base';
import { ProcurementRfqBusinessPartnerBehavior } from '../../behaviors/rfq-business-partner-behavior.service';
import { ProcurementRfqBusinessPartnerDataService } from '../../services/rfq-business-partner-data.service';
import { IRfqBusinessPartnerEntity } from '../entities/rfq-businesspartner-entity.interface';
import { ProcurementRfqBusinesspartnerValidationService } from '../../services/validations/rfq-businesspartner-validation.service';
import { ProcurementRfqBusinessPartnerLayoutService } from '../../services/layouts/rfq-business-partner-layout.service';

export const RFQ_BUSINESS_PARTNER_ENTITY_INFO_CONFIG: IEntityInfo<IRfqBusinessPartnerEntity> = {
	grid: {
		title: {
			key: 'procurement.rfq.businessPartnerGridTitle'
		},
		behavior: ctx => ctx.injector.get(ProcurementRfqBusinessPartnerBehavior)
	},
	form: {
		title: {
			key: 'procurement.rfq.businessPartnerFormTitle'
		},
		containerUuid: '2b0438dbe5284193be28b817623592ea',
	},
	dtoSchemeId: {
		moduleSubModule: 'Procurement.RfQ',
		typeName: 'RfqBusinessPartnerDto'
	},
	permissionUuid: 'a2f96b998a304eecadbc246514c4089a',
	dataService: ctx => ctx.injector.get(ProcurementRfqBusinessPartnerDataService),
	validationService: ctx => ctx.injector.get(ProcurementRfqBusinesspartnerValidationService),
	layoutConfiguration: (context) => {
		return context.injector.get(ProcurementRfqBusinessPartnerLayoutService).generateLayout();
	}
};