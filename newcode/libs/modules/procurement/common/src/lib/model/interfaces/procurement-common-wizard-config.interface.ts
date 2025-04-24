/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, DataServiceFlatRoot, DataServiceHierarchicalRoot } from '@libs/platform/data-access';
import { CompleteIdentification, IEntityIdentification } from '@libs/platform/common';
import { IPrcCommonReadonlyService } from './prc-common-readonly-service.interface';

export interface IProcurementCommonWizardConfig<T extends IEntityIdentification, U extends CompleteIdentification<T>> {
	rootDataService: (DataServiceHierarchicalRoot<T, U> | DataServiceFlatRoot<T, U>) & IPrcCommonReadonlyService<T>;
	rootValidationService?: BaseValidationService<T>;
}
