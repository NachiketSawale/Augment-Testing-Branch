/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementRfqHeaderGridBehavior } from '../../behaviors/procurement-rfq-header-behavior.service';
import { ProcurementRfqHeaderMainDataService } from '../../services/procurement-rfq-header-main-data.service';
import { RfqHeaderValidationService } from '../../services/validations/procurement-rfq-header-validation.service';
import { ProcurementRfqHeaderEntityInfoFactory } from './../../services/entity-info/rfq-header-entity-info.service';

export const RFQ_ENTITY_INFO = ProcurementRfqHeaderEntityInfoFactory.create({
	permissionUuid: '037c70c17687481a88c726b1d1f82459',
	formContainerUuid: '3C925CAC7A1C46CA88CECE88FE1EF481',
	dataService: (ctx) => ctx.injector.get(ProcurementRfqHeaderMainDataService),
	behavior: (ctx) => ctx.injector.get(ProcurementRfqHeaderGridBehavior),
	validationService: (ctx) => ctx.injector.get(RfqHeaderValidationService),
});