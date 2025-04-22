/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IAccordionItem } from '@libs/ui/common';

/**
 * Extended accordion item interface for quickstart.
 */
export interface IQuickstartAccordionData extends IAccordionItem {
	/**
	 * Redirect url.
	 */
	redirect?: string | undefined;

	/**
	 * module/page display name.
	 */
	displayName?: string;

	/**
	 * Unique module id.
	 */
	moduleId?: string | number;
}
