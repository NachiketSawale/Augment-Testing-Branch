/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IMenuItemsList } from '@libs/ui/common';

/**
 * Defines properties for configuring a simple search feature
 */
export interface ISimpleSearchConfigOption {
	translated?: boolean;
	toolBarDefs: IMenuItemsList;
	title: string;
	searchType: string;
	cssClass: string;
	settingsActive: boolean;
}
