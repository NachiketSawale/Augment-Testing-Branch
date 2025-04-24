/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IAccordionItem } from '@libs/ui/common';

import { IReportParameter, IReportError } from '@libs/platform/common';

/**
 * Report sidebar accordion data interface.
 */
export interface ISidebarReportAccordionData extends IAccordionItem {
	/**
	 * Unique group id.
	 */
	groupId?: number;

	/**
	 * Name of file (e.g. Overview.frx).
	 */
	filename?: string;

	/**
	 * File path (e.g. system\\Project)
	 */
	path?: string;

	/**
	 * Report parameters.
	 */
	parameters?: number | IReportParameter[];

	/**
	 * Boolean for storing in documents.
	 */
	storeInDocs?: boolean;

	/**
	 * Boolean for store in Document state.
	 */
	storeInDocsState?: boolean;

	/**
	 * Category of document.
	 */
	documentCategory?: number | null;

	/**
	 * Type of document.
	 */
	documentType?: number | null;

	/**
	 * Rubic category.
	 */
	rubricCategory?: number | null;

	/**
	 * Hidden parameters.
	 */
	hiddenParameters?: IReportParameter[];

	/**
	 * Dialog section.
	 */
	dialogSection?: object;

	/**
	 * Export type(e.g. pdf).
	 */
	exportType?: string;

	/**
	 * Sort order.
	 */
	sort?: number;

	/**
	 * Errors present.
	 */
	errors?: IReportError[];

	/**
	 * Is search string present.
	 */
	isSearch?: boolean;

	/**
	 * Flag for error.
	 */
	hasError?: boolean;

	/**
	 * Flag to show details.
	 */
	showDetails?: boolean;

	/**
	 * Flag if process is pending.
	 */
	pending?: boolean;

	/**
	 * Accordion child items.
	 */
	children?: ISidebarReportAccordionData[];
}
