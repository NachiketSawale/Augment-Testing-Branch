/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IProjectStockLocationEntityGenerated } from './project-stock-location-entity-generated.interface';

export interface IProjectStockLocationEntity extends IProjectStockLocationEntityGenerated {
	/*
	* HasChildren
   */
	HasChildren?: boolean | null;
}
