/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { ISidebarFavoritesFavType } from './sidebar-favorites-favtype.interface';
import { ISidebarFavoritesProjectName } from './sidebar-favorites-project-name.interface';

/**
 * Information of project.
 */
export interface ISidebarFavoritesProject {
	/**
	 * Unique id of project.
	 */
	projectId: number;

	/**
	 * Description of project.
	 */
	projectDescription: string;

	/**
	 * Project leave items information.
	 */
	itemToFavType: Record<string | number, ISidebarFavoritesFavType[]>;

	/**
	 * Date when project added.
	 */
	addedAt: string;

	/**
	 * Name of the project.
	 */
	projectName: string | ISidebarFavoritesProjectName;
}
