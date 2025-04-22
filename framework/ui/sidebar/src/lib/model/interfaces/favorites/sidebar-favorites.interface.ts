/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Project settings information.
 */
export interface ISidebarFavorites {
	/**
	 * Unique id of the project.
	 */
	projectId: number;

	/**
	 * Name of the project.
	 */
	projectName: string;

	/**
	 * Expanded state for project items.
	 */
	expanded: Record<string | number, boolean>;

	/**
	 * Date when project is added.
	 */
	addedAt: string;
}
