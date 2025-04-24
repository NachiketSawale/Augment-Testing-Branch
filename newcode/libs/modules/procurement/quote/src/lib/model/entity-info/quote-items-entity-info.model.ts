/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonItemEntityInfo } from '@libs/procurement/common';
import { ProcurementQuoteItemDataService } from '../../services/procurement-quote-item-data.service';
import { ProcurementQuoteItemValidationService } from '../../services/validations/quote-items-validation.service';
import { ProcurementQuoteItemBehavior } from '../../behaviors/quote-items-behavior.service';

export const PROCUREMENT_QUOTE_ITEM_ENTITY_INFO = ProcurementCommonItemEntityInfo.create({
	permissionUuid: '274DA208B3DA47988366D48F38707DE1',
	formUuid: '274DA208B3DA47988366D48F38707DE2',
	dataServiceToken: ProcurementQuoteItemDataService,
	validationServiceToken: ProcurementQuoteItemValidationService,
	behavior: ProcurementQuoteItemBehavior
});