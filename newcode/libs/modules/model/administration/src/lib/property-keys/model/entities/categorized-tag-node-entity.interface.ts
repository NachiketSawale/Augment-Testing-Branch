/*
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents a property key tag or its category when displayed in a tree overview.
 */
export interface ICategorizedTagNodeEntity {

	/**
	 * The unique node ID.
	 */
	Id: number | string;

	/**
	 * The human-readable description.
	 */
	Description?: string;

	/**
	 * The ID of the parent node.
	 */
	ParentId?: number | string;

	/**
	 * Indicates whether the node is a tag (`true`).
	 * If this is `false`, it is a tag category.
	 */
	IsTag: boolean;

	// transient fields

	/**
	 * The parent node of the current node.
	 */
	parent?: ICategorizedTagNodeEntity;

	/**
	 * The child nodes of the current node.
	 */
	children?: ICategorizedTagNodeEntity[];

	/**
	 * A CSS class identifier for the node icon.
	 */
	image?: string;
}
