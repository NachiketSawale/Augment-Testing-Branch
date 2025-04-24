/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonTotalEntityInfo } from '@libs/procurement/common';
import { ProcurementQuoteTotalDataService } from '../../services/quote-total-data.service';
import { ProcurementQuoteTotalBehavior } from '../../behaviors/quote-total-behavior.service';
import { ProcurementModule } from '@libs/procurement/shared';
import { ProcurementQuoteTotalValidationService } from '../../services/validations/quote-total-validation.service';

export const QUOTE_TOTAL_ENTITY_INFO = ProcurementCommonTotalEntityInfo.create({
	permissionUuid: '4C1C7E4B63D64C43A95E701A7FFC530E',
	formUuid: '4C1C7E4B63D64C43A95E701A7FFC530F',
	dataServiceToken: ProcurementQuoteTotalDataService,
	validationServiceToken: ProcurementQuoteTotalValidationService,
	behavior: ProcurementQuoteTotalBehavior,
	dtoSchemeConfig: { moduleSubModule: ProcurementModule.Requisition, typeName: 'ReqTotalDto' }
});