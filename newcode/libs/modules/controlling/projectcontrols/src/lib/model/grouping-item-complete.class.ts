/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IControllingUnitGroupingItemEntity } from './entities/controlling-unit-grouping-item-entity.interface';

export class GroupingItemComplete implements CompleteIdentification<IControllingUnitGroupingItemEntity> {
	/*
	 * GroupingItem
	 */
	public GroupingItem?: IControllingUnitGroupingItemEntity | null = {};

	/*
	 * MainItemId
	 */
	public MainItemId?: number | null = 10;
}
