/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonTotalEntityInfo } from '@libs/procurement/common';
import { ProcurementRfqTotalDataService } from '../../services/rfq-total-data.service';
import { ProcurementRfqTotalBehavior } from '../../behaviors/rfq-total-behavior.service';
import { ProcurementModule } from '@libs/procurement/shared';
import { ProcurementRFQTotalValidationService } from '../../services/validations/rfq-total-validation.service';

export const RFQ_TOTAL_ENTITY_INFO = ProcurementCommonTotalEntityInfo.create({
	permissionUuid: '985f496b39eb4cd08d9cd4f9f3c8d1e4',
	formUuid: '688C5EBBA4B14C769E70C9D35FD573A1',
	dataServiceToken: ProcurementRfqTotalDataService,
	validationServiceToken: ProcurementRFQTotalValidationService,
	behavior: ProcurementRfqTotalBehavior,
	dtoSchemeConfig: { moduleSubModule: ProcurementModule.Requisition, typeName: 'ReqTotalDto' }
});