/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * Represents the content of a single container group in a container layout.
 */
export interface IContainerGroupLayout {

	/**
	 * The UUIDs of the containers in the container group.
	 */
	readonly content: string[];

	/**
	 * The ID of the pane the container group represents.
	 */
	readonly pane: string;

	/**
	 * The index of the initially active tab in the group.
	 */
	readonly activeTab?: number;
}