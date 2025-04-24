/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Interface representing an entity filter list item.
 */
export interface IEntityFilterListItem {
	/** The Id, integer or string */
	Id: number | string;

	/** The Description after translated */
	Description: string;

	/** Is selected */
	IsSelected?: boolean;

	/** The parent fk */
	ParentFk?: number | string;

	/** The ChildItems for tree structure */
	ChildItems?: IEntityFilterListItem[];
}