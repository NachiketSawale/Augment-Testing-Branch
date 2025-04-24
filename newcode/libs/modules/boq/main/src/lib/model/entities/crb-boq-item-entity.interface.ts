/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICrbBoqItemEntityGenerated } from './crb-boq-item-entity-generated.interface';

export interface ICrbBoqItemEntity extends ICrbBoqItemEntityGenerated {
	EcoDevisInfoMap?: Map<string,string>;
	RevisionInfoMark?: string;
}
