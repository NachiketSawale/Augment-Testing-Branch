/*
 * Copyright(c) RIB Software GmbH
 */

import { InjectionToken } from '@angular/core';

/**
 * Interface representing the options for material filter.
 */
export interface IMaterialFilterOptions {
	/**
	 * Disable create similar material
	 */
	isDisableCreateSimilar?: false;

	/**
	 * Enable multiple select
	 */
	isEnableMultiSelect?: false;
}

/**
 * injection token of material filter options
 */
export const MATERIAL_FILTER_OPTIONS = new InjectionToken<IMaterialFilterOptions>('MATERIAL_FILTER_OPTIONS');
