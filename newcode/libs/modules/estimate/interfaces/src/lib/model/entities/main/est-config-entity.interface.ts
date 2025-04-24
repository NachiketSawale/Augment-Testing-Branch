/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstConfigEntityGenerated } from './est-config-entity-generated.interface';

export interface IEstConfigEntity extends IEstConfigEntityGenerated {
	/*
	 * WicCatFk
	 */
	EstUppConfigTypeFk?: number | null;
}
