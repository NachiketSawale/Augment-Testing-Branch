/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonGeneralsEntityInfo } from '@libs/procurement/common';
import { ProcurementQuoteGeneralsDataService } from '../../services/quote-generals-data.service';
import { ProcurementQuoteGeneralsValidationService } from '../../services/quote-generals-validation.service';

export const QUOTE_GENERALS_ENTITY_INFO = ProcurementCommonGeneralsEntityInfo.create({
	permissionUuid: 'E2A1CCCDA07D48E68F2B0FC4208E61EE',
	formUuid: '9464743619C2400099EC2D759E72D07C',
	dataServiceToken: ProcurementQuoteGeneralsDataService,
	validationServiceToken: ProcurementQuoteGeneralsValidationService
});