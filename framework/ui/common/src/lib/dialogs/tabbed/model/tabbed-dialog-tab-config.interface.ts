/*
 * Copyright(c) RIB Software GmbH
 */

import { Translatable } from '@libs/platform/common';
import { Type } from '@angular/core';

/**
 * Tabbed dialog tab configuration
 */
export interface ITabbedDialogTabConfig {
	/**
	 * Tab uuid
	 */
	uuid: string;

	/**
	 * Tab header
	 */
	tabHeader: Translatable;

	/**
	 * Body component
	 */
	bodyComponent: Type<object>
}