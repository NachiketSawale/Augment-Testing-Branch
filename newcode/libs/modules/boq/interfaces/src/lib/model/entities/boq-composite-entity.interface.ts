/*
 * Copyright(c) RIB Software GmbH
 */

import { IBoqHeaderEntity } from './boq-header-entity.interface';
import { IBoqItemEntity } from './boq-item-entity.interface';

export interface IBoqCompositeEntity {
	/*
	* BoqHeader
	*/
	BoqHeader: IBoqHeaderEntity;

	/*
	* BoqRootItem
	*/
	BoqRootItem: IBoqItemEntity;
}