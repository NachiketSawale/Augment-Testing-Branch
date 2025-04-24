/*
 * Copyright(c) RIB Software GmbH
 */

import { IBoqItemEntity } from '@libs/boq/interfaces';
import { IOrdBoqEntityGenerated } from './ord-boq-entity-generated.interface';

export interface IOrdBoqEntity extends IOrdBoqEntityGenerated {
	/*
	 * BoqRootItem
	 */
	BoqRootItem: IBoqItemEntity;
}
