/*
 * Copyright(c) RIB Software GmbH
 */

import { ICompositeItemEntity } from '../item/composite-item-entity.interface';
import { ICompositeBoqEntity } from '../boq/composite-boq-entity.interface';

export interface IChartDataContext {
	type: string;
	selected?: ICompositeItemEntity | ICompositeBoqEntity | null;
}