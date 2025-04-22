/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { IAccordionItem } from '@libs/ui/common';

/**
 * Extended interface for sidebar favorites tab data.
 */
export interface ISidebarFavoriteAccordionData extends IAccordionItem {
	/**
	 * Unique id for the project.
	 */
	projectId?: number;

	/**
	 * Unique id for the project item(leave item).
	 */
	itemId?: number;

	/**
	 * Fav type number for the project item.
	 */
	favType?: number;
}
