/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonSubcontractorEntityInfo } from '@libs/procurement/common';
import { ProcurementPackageSubcontractorValidationService } from '../../services/validations/procurement-package-subcontractor-validation.service';
import { ProcurementPackageSubcontractorDataService } from '../../services/procurement-package-subcontractor-data.service';
/**
 * procurement package subcontractor entity info
 */
export const PROCUREMENT_PACKAGE_SUBCONTRACTOR_ENTITY_INFO = ProcurementCommonSubcontractorEntityInfo.create({
	permissionUuid: 'bc860c5260774379a8509355f4048f31',
	formUuid: '5516761ed60c449e9f8fef302c4595d3',
	validationServiceToken: ProcurementPackageSubcontractorValidationService,
	dataServiceToken: ProcurementPackageSubcontractorDataService,
});