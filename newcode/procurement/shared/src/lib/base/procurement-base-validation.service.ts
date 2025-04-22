/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService } from '@libs/platform/data-access';
import { inject } from '@angular/core';
import { PlatformHttpService, PlatformTranslateService } from '@libs/platform/common';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';

/**
 * Procurement base validation service base on platform one
 */
export abstract class ProcurementBaseValidationService<T extends object> extends BaseValidationService<T> {
	protected readonly http = inject(PlatformHttpService);
	protected readonly translationService = inject(PlatformTranslateService);
	protected readonly validationUtils = inject(BasicsSharedDataValidationService);
}
