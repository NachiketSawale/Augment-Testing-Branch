/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { GroupingItemComplete } from './grouping-item-complete.class';

import { CompleteIdentification } from '@libs/platform/common';

export class ProjectControlsComplete implements CompleteIdentification<GroupingItemComplete> {
	/*
	 * EntitiesCount
	 */
	public EntitiesCount?: number | null = 10;

	/*
	 * GroupingItemToSave
	 */
	public GroupingItemToSave?: GroupingItemComplete[] | null = [];

	/*
	 * MainItemId
	 */
	public MainItemId?: number | null = 10;
}
