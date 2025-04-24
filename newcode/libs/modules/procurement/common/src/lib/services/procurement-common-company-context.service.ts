/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { BasicsSharedCompanyContextService } from '@libs/basics/shared';

/**
 * @deprecated will be removed later, use the new {@link BasicsSharedCompanyContextService} base class instead.
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonCompanyContextService extends BasicsSharedCompanyContextService {
	// we can add procurement specific logic here about login company
}
