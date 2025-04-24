/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IUiLanguage } from '../../model/ui-data-languages/ui-language.interface';


/**
 * Language item data interface.
 */
export interface IReportLanguageItems extends IUiLanguage {
	/**
	 * Unique language item id.
	 */
	id: number;

	/**
	 * Css class for item.
	 */
	cssClass: string;

	/**
	 * language caption.
	 */
	caption: string;

	/**
	 * Tooltip value.
	 */
	toolTip: string;

	/**
	 * Item icon class.
	 */
	iconClass: string;

	/**
	 * Item type.
	 */
	type: string;

	/**
	 * Call back to be executed on item click.
	 */
	fn?: (item: IReportLanguageItems) => void;
}
