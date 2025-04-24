/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDefaultPage } from './default-page.interface';
import { ITilesData } from './tile.interface';

/**
 * An interface current setting for desktop page.
 */
export interface ICurrentSetting {
	/**
	 * The default Desktop pages for desktop module.
	 */
	desktopPages?: IDefaultPage[];

	/**
	 * The default modules for Desktop.
	 */
	modules?: ITilesData[];

	

}
