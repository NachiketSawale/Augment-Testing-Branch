/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonWarrantyEntityInfo } from '@libs/procurement/common';
import { ProcurementQuoteWarrantyDataService } from '../../services/quote-warranty-data.service';
import { ProcurementQuoteWarrantyValidationService } from '../../services/validations/quote-warranty-validation.service';

export const PROCUREMENT_QUOTE_WARRANTY_ENTITY_INFO = ProcurementCommonWarrantyEntityInfo.create({
	permissionUuid: '5dadbe5bf64b4f479360ef98306ffb3a',
	formUuid: '25ea96a516174247bcc8587d7f9dfb4a',
	dataServiceToken: ProcurementQuoteWarrantyDataService,
	validationServiceToken: ProcurementQuoteWarrantyValidationService
});

