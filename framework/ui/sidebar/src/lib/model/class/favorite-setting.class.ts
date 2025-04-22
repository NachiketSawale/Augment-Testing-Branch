/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Class provides the instance for newly added project.
 */
export class FavoritesSettings {
	/**
	 * Expanded state for project.
	 */
	public expanded: Record<string | number, boolean>;

	/**
	 * Date when project added.
	 */
	public addedAt = new Date().toISOString();

	public constructor(public projectId: number, public projectName: string, isExpanded: boolean) {
		this.expanded = isExpanded ? this.prepareExpandDetails(projectId, isExpanded) : this.prepareExpandDetails('0', true);
	}

	/**
	 * Prepares the expand details object.
	 *
	 * @param {string|number} key Object key.
	 * @param {boolean} value Object value.
	 * @returns {Record<string|number,boolean>} Object.
	 */
	private prepareExpandDetails(key: string | number, value: boolean): Record<string | number, boolean> {
		return {
			[key]: value,
		};
	}
}
