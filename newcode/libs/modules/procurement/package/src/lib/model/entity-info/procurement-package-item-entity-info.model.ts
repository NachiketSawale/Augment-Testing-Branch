/*
 * Copyright(c) RIB Software GmbH
 */

import { ProcurementCommonItemEntityInfo } from '@libs/procurement/common';
import { ProcurementPackageItemDataService } from '../../services/procurement-package-item-data.service';
import { ProcurementPackageItemValidationService } from '../../services/validations/procurement-package-item-validation.service';
import { ProcurementPackageItemBehavior } from '../../behaviors/procurement-package-item-behavior.service';


export const PROCUREMENT_PACKAGE_ITEM_ENTITY_INFO = ProcurementCommonItemEntityInfo.create({
	permissionUuid: 'fb938008027f45a5804b58354026ef1c',
	formUuid: 'f68a72c231c942e78fb499f0f8ee0cb0',
	dataServiceToken: ProcurementPackageItemDataService,
	validationServiceToken: ProcurementPackageItemValidationService,
	behavior: ProcurementPackageItemBehavior
});