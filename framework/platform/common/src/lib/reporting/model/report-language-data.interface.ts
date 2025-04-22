/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IReportLanguageItems } from './report-language-items.interface';

/**
 * Report language data.
 */
export interface IReportLanguageData {
	/**
	 * To check whether to show images
	 */
	showImages: boolean;

	/**
	 * To check whether to show titles
	 */
	showTitles: boolean;

	/**
	 * The item type.
	 */
	type?: number;

	/**
	 * Active language id.
	 */
	activeValue?: number | string;

	/**
	 * Langauge information.
	 */
	items?: IReportLanguageItems[];
}
